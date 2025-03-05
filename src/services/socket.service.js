const { PinoLogger } = require('@papdaew/shared');
const { Server } = require('socket.io');
const { io: ioClient } = require('socket.io-client');

const Config = require('#gateway/configs/config.js');

class SocketService {
  #io;
  #notificationServiceClient;
  #logger;
  #config;
  static #instance;

  constructor() {
    if (SocketService.#instance) {
      return SocketService.#instance;
    }

    this.#config = new Config();
    this.#logger = new PinoLogger().child({
      service: 'Socket Service',
    });

    SocketService.#instance = this;
  }

  initialize(server) {
    this.#setupSocketServer(server);
    this.#connectToNotificationService();
    this.#setupEventForwarding();
    this.#logger.info('Socket.IO Gateway initialized');
  }

  #setupSocketServer(server) {
    this.#io = new Server(server, {
      cors: {
        origin: this.#config.ALLOWED_ORIGINS
          ? this.#config.ALLOWED_ORIGINS.split(',')
          : '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
      },
      path: '/socket.io',
    });

    this.#logger.info('Socket.IO server initialized');
  }

  #connectToNotificationService() {
    this.#notificationServiceClient = ioClient(
      this.#config.NOTIFICATION_SERVICE_URL,
      {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
      }
    );

    this.#notificationServiceClient.on('connect', () => {
      this.#logger.info(
        `Connected to notification service at ${
          this.#config.NOTIFICATION_SERVICE_URL
        }`
      );
    });

    this.#notificationServiceClient.on('disconnect', reason => {
      this.#logger.warn(
        { reason },
        'Disconnected from notification service, attempting to reconnect'
      );
    });

    this.#notificationServiceClient.on('connect_error', error => {
      this.#logger.error(
        { error: error.message },
        'Error connecting to notification service'
      );
    });
  }

  #setupEventForwarding() {
    // Handle client connections to the gateway
    this.#io.on('connection', socket => {
      this.#logger.info({ socketId: socket.id }, 'Client connected to gateway');

      // Forward join event from client to notification service
      socket.on('join', userId => {
        if (!userId) {
          return;
        }

        this.#notificationServiceClient.emit('join', userId);
        this.#logger.info(
          { socketId: socket.id, userId },
          'Forwarded join event to notification service'
        );
      });

      // Handle client disconnection
      socket.on('disconnect', () => {
        this.#logger.info(
          { socketId: socket.id },
          'Client disconnected from gateway'
        );
      });

      // Forward any custom events from client to notification service
      socket.onAny((event, ...args) => {
        if (event !== 'join' && event !== 'disconnect') {
          this.#notificationServiceClient.emit(event, ...args);
          this.#logger.info(
            { socketId: socket.id, event },
            'Forwarded custom event to notification service'
          );
        }
      });
    });

    // Forward events from notification service to connected clients
    this.#notificationServiceClient.onAny((event, ...args) => {
      this.#io.emit(event, ...args);
      this.#logger.info(
        { event },
        'Forwarded event from notification service to clients'
      );
    });
  }

  get io() {
    return this.#io;
  }
}

module.exports = SocketService;

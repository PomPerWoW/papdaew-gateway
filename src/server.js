const http = require('http');

const {
  globalErrorHandler,
  NotFoundError,
  PinoLogger,
} = require('@papdaew/shared');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');

const Config = require('#gateway/configs/config.js');
const HealthRoutes = require('#gateway/routes/health.route.js');
const ProxyService = require('#gateway/services/proxy.service.js');

class GatewayServer {
  #app;
  #server;
  #logger;
  #config;
  #healthRoutes;
  #proxyService;

  constructor() {
    this.#app = express();
    this.#config = new Config();
    this.#logger = new PinoLogger().child({
      service: 'Gateway Server',
    });
    this.#healthRoutes = new HealthRoutes();
    this.#proxyService = new ProxyService();
  }

  setup = () => {
    this.#setupSecurityMiddleware(this.#app);
    this.#proxyService.setup(this.#app);
    this.#setupMiddleware(this.#app);
    this.#setupRoutes(this.#app);
    this.#setupErrorHandlers(this.#app);
    return this.#app;
  };

  start = () => {
    this.setup();
    this.#startServer(this.#app);
  };

  #setupSecurityMiddleware = app => {
    app.set('trust proxy', true);
    app.use(cors());
    app.use(cookieParser());
    app.use(helmet());
    app.use(hpp());
  };

  #setupMiddleware = app => {
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  };

  #setupRoutes = app => {
    app.use('/', this.#healthRoutes.setup());
  };

  #setupErrorHandlers = app => {
    app.all('*', (req, _res, next) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      this.#logger.error(`${fullUrl} endpoint does not exist.`);
      next(
        new NotFoundError(
          `Can't find ${req.method}:${req.originalUrl} on this server!`
        )
      );
    });

    app.use(globalErrorHandler);
  };

  #startServer = app => {
    try {
      this.#server = http.createServer(app);
      this.#server.listen(this.#config.PORT, () => {
        this.#logger.info(
          `API Gateway service is running on port ${this.#config.PORT}`
        );
      });
    } catch (error) {
      this.#logger.error(error, 'Failed to start server');
      process.exit(1);
    }
  };

  close = () =>
    new Promise((resolve, reject) => {
      this.#server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
}

module.exports = GatewayServer;

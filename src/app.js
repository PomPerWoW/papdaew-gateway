const { PinoLogger } = require('@papdaew/shared');

const Config = require('#gateway/configs/config.js');
const GatewayServer = require('#gateway/server.js');

class Application {
  constructor() {
    this.config = new Config();
    this.appLogger = new PinoLogger({
      name: 'Gateway Application',
      level: this.config.LOG_LEVEL,
      serviceVersion: this.config.SERVICE_VERSION,
      environment: this.config.NODE_ENV,
    });
    this.server = new GatewayServer();
  }

  initialize = () => {
    this.appLogger.info('Initializing Gateway Application');
    this.setupUncaughtException();
    this.server.start();
    this.setupUnhandledRejection();
    this.setupShutdown();
  };

  setupUncaughtException = () => {
    process.once('uncaughtException', error => {
      this.appLogger.error(`Uncaught Exception: ${error.name}`, error);
      process.exit(1);
    });
  };

  setupUnhandledRejection = () => {
    process.once('unhandledRejection', error => {
      this.appLogger.error(`Unhandled Rejection: ${error.name}`, error);
      this.server.close();
      process.exit(1);
    });
  };

  setupShutdown = () => {
    const shutdown = async () => {
      try {
        await this.server.close();
        process.exit(0);
      } catch (error) {
        this.appLogger.error(`Error during shutdown: ${error.name}`, error);
        process.exit(1);
      }
    };

    process.once('SIGTERM', shutdown);
    process.once('SIGINT', shutdown);
  };
}

const application = new Application();

application.initialize();

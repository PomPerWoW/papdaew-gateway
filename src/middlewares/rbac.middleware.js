const { ForbiddenError, PinoLogger } = require('@papdaew/shared');

const Config = require('#gateway/config.js');

class RBACMiddleware {
  #config;
  #logger;

  constructor() {
    this.#config = new Config();
    this.#logger = new PinoLogger({
      name: 'RBAC Middleware',
      level: this.#config.LOG_LEVEL,
      serviceVersion: this.#config.SERVICE_VERSION,
      environment: this.#config.NODE_ENV,
    });
  }

  checkRole = role => (req, _res, next) => {
    if (!req.currentUser.roles.includes(role)) {
      this.#logger.error(
        'User does not have permission to access this resource'
      );
      throw new ForbiddenError(
        'User does not have permission to access this resource'
      );
    }

    next();
  };
}

module.exports = RBACMiddleware;

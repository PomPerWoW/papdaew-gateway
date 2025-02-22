const { UnauthorizedError } = require('@papdaew/shared');
const { PinoLogger } = require('@papdaew/shared');
const jwt = require('jsonwebtoken');

const Config = require('#gateway/config.js');

class AuthMiddleware {
  #config;
  #logger;

  constructor() {
    this.#config = new Config();
    this.#logger = new PinoLogger({
      name: 'Auth Middleware',
      level: this.#config.LOG_LEVEL,
      serviceVersion: this.#config.SERVICE_VERSION,
      environment: this.#config.NODE_ENV,
    });
  }

  verifyToken = async (req, _res, next) => {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        this.#logger.error('No token provided');
        throw new UnauthorizedError('No token provided');
      }

      const decoded = jwt.verify(token, this.#config.JWT_SECRET);

      req.currentUser = decoded;

      next();
    } catch (error) {
      this.#logger.error(error);
      next(new UnauthorizedError('Invalid token'));
    }
  };

  checkAuthenticated = async (req, _res, next) => {
    if (!req.currentUser) {
      this.#logger.error('User is not authenticated');
      throw new UnauthorizedError('User is not authenticated');
    }

    next();
  };
}

module.exports = AuthMiddleware;

const { UnauthorizedError, PinoLogger } = require('@papdaew/shared');
const jwt = require('jsonwebtoken');

const Config = require('#gateway/configs/config.js');

class AuthMiddleware {
  #config;
  #logger;

  constructor() {
    this.#config = new Config();
    this.#logger = new PinoLogger().child({
      service: 'Auth Middleware',
    });
  }

  verifyToken = async (req, _res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      this.#logger.error('No token provided');
      return next(new UnauthorizedError('No token provided'));
    }

    const decoded = jwt.verify(token, this.#config.JWT_SECRET);

    req.user = decoded;
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-role'] = decoded.role;

    next();
  };

  checkAuthenticated = async (req, _res, next) => {
    if (!req.user) {
      this.#logger.error('User is not authenticated');
      throw new UnauthorizedError('User is not authenticated');
    }

    next();
  };
}

module.exports = AuthMiddleware;

const { ForbiddenError, PinoLogger } = require('@papdaew/shared');

class RBACMiddleware {
  #logger;

  constructor() {
    this.#logger = new PinoLogger().child({
      service: 'RBAC Middleware',
    });
  }

  checkRole = role => (req, _res, next) => {
    if (!req.user.role.includes(role)) {
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

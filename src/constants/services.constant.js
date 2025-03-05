const Config = require('#gateway/configs/config.js');
const AuthMiddleware = require('#gateway/middlewares/auth.middleware.js');

const config = new Config();

class ServicesConstant {
  constructor() {
    this.authMiddleware = new AuthMiddleware();
  }

  get services() {
    return [
      {
        route: '/api/v1/auth',
        target: config.AUTH_SERVICE_URL,
      },
      {
        route: '/api/v1/users',
        target: config.USERS_SERVICE_URL,
        middleware: [this.authMiddleware.verifyToken],
      },
      {
        route: '/api/v1/notifications',
        target: config.NOTIFICATION_SERVICE_URL,
        middleware: [this.authMiddleware.verifyToken],
      },
    ];
  }
}

module.exports = ServicesConstant;

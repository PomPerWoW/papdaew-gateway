const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

class Config {
  constructor() {
    this.PORT = process.env.PORT || 3000;
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
    this.SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
    this.SESSION_SECRET = process.env.SESSION_SECRET;
    this.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
    this.USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;
    this.NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;
    this.VENDOR_SERVICE_URL = process.env.VENDOR_SERVICE_URL;
    this.QUEUE_SERVICE_URL = process.env.QUEUE_SERVICE_URL;
    this.ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL;
    this.LOCATIONS_SERVICE_URL = process.env.LOCATIONS_SERVICE_URL;
  }
}

module.exports = Config;

const Config = require('#gateway/config.js');

const config = new Config();

const services = [
  {
    route: '/api/v1/auth',
    target: config.AUTH_SERVICE_URL,
  },
];

module.exports = services;

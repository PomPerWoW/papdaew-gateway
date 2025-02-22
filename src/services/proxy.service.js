const { createProxyMiddleware } = require('http-proxy-middleware');

const services = require('#gateway/constants/services.constant.js');

class ProxyService {
  #services;

  constructor() {
    this.#services = services;
  }

  setup(app) {
    this.#services.forEach(service => {
      const proxyOptions = {
        target: service.target,
        changeOrigin: true,
      };

      app.use(
        service.route,
        ...(service.middleware || []),
        createProxyMiddleware(proxyOptions)
      );
    });
  }
}

module.exports = ProxyService;

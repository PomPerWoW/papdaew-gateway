const { createProxyMiddleware } = require('http-proxy-middleware');

const ServicesConstant = require('#gateway/constants/services.constant.js');

class ProxyService {
  #services;

  constructor() {
    this.#services = new ServicesConstant();
  }

  setup(app) {
    this.#services.services.forEach(service => {
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

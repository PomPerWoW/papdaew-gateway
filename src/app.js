const GatewayServer = require('#gateway/server.js');

class Application {
  constructor() {
    this.server = new GatewayServer();
  }

  initialize() {
    this.server.start();
  }
}

const application = new Application();
application.initialize();

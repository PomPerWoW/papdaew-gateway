const { PinoLogger, asyncHandler } = require('@papdaew/shared');
const { StatusCodes } = require('http-status-codes');

class HealthController {
  #logger;

  constructor() {
    this.#logger = new PinoLogger().child({
      service: 'Health Controller',
    });
  }

  getHealth = asyncHandler(async (req, res) => {
    this.#logger.info('GET: /health');
    res.status(StatusCodes.OK).send('API Gateway service is healthy and OK');
  });

  error = asyncHandler(async (req, res) => {
    this.#logger.error('GET: /error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('API Gateway service is unhealthy');
  });
}

module.exports = HealthController;

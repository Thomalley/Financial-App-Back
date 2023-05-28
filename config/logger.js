const winston = require('winston');

module.exports = (name, env) => {
  const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: {
      service: `${name}-service-${env}`,
    },
    transports: [
      new winston.transports.Console(),
    ],
  });

  const error = (payload) => {
    logger.error({
      payload,
    });
  };

  const warn = (payload) => {
    logger.warn({
      payload,
    });
  };

  const info = (payload) => {
    logger.info({
      payload,
    });
  };

  const http = (payload) => {
    logger.http({
      payload,
    });
  };

  const verbose = (payload) => {
    logger.verbose({
      payload,
    });
  };

  const debug = (payload) => {
    logger.debug({
      payload,
    });
  };

  return {
    error,
    warn,
    info,
    http,
    verbose,
    debug,
  };
};

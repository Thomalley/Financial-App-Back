const express = require('express');

const config = require('./config');

const app = express();

module.exports = ({
  db,
  logger,
  axios,
}) => {
  app.locals.logger = logger;
  app.locals.db = db;
  app.locals.axios = axios;
  config(app);
  return app;
};

const express = require('express');
const cors = require('cors');

const { BODY_LIMIT = '2mb' } = process.env;

module.exports = (app) => {
  app.use(express.json({
    limit: BODY_LIMIT,
  }));

  app.use(cors());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  // Extra
  app.disable('x-powered-by');
};

const express = require('express');
const user = require('../controllers/user');
const income = require('../controllers/income');

module.exports = (app) => {
  const router = express.Router();

  user(app, router);
  income(app, router);

  return router;
};

const express = require('express');
const index = require('../controllers/index');
const auth = require('../controllers/auth');
const user = require('../controllers/user');

module.exports = (app) => {
  const router = express.Router();

  auth(app, router);
  user(app, router);

  return router;
};

const express = require('express');
const auth = require('../controllers/auth');
const user = require('../controllers/user');

module.exports = (app) => {
  const router = express.Router();

  auth(app, router);
  user(app, router);

  return router;
};

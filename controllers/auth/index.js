const routes = require('./auth.routes');

module.exports = (app, router) => {
  routes(app, router);
};

const routes = require('./user.routes');

module.exports = (app, router) => {
  routes(app, router);
};

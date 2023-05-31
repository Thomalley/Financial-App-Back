const {
  getUserById,
  putUser,
} = require('./user.ctrl');

const {
  putUserValidation,
  getUserByIdValidation,
} = require('./user.validations');

const { registerUserValidation } = require('../auth/auth.validations');

const { isAuthorized } = require('../auth/auth.middlewares');

const { postRegister } = require('../auth/auth.ctrl');

module.exports = (app, router) => {
  router.post(
    '/user/create',
    registerUserValidation(),
    postRegister(),
  );
  router.put(
    '/user/put',
    isAuthorized(),
    putUserValidation(app),
    putUser(app),
  );
  router.get(
    '/user/:id',
    isAuthorized(),
    getUserByIdValidation(app),
    getUserById(app),
  );
};

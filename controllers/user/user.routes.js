const {
  getUserById,
  putUser,
  postLogin,
  postRegister,
} = require('./user.ctrl');

const {
  putUserValidation,
  getUserByIdValidation,
  postLoginValidation,
  registerUserValidation,
} = require('./user.validations');

const { isAuthorized } = require('../auth/auth.middlewares');

module.exports = (app, router) => {
  router.post(
    '/login',
    postLoginValidation(app),
    postLogin(app),
  );
  router.post(
    '/user/create',
    registerUserValidation(app),
    postRegister(app),
  );
  router.put(
    '/user/edit',
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

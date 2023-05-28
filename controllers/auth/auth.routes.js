const {
  postLoginValidation,
  userVerificationValidation,
} = require('./auth.validations');
const {
  postRegister,
  postLogin,
  recoverPassword,
  resetPassword,
  userVerification,
} = require('./auth.ctrl');

const {
  postRegisterValidation,
} = require('./auth.validations');
const { isAuthorized } = require('./auth.middlewares');
const { WRITE } = require('../../misc/const/permissions');
const { verifyGroup } = require('../../misc/utils/group');

const controllerName = 'auth';

module.exports = async (app, router) => {
  verifyGroup(app, controllerName);
  router.post(
    '/register',
    isAuthorized(app, WRITE, controllerName),
    postRegisterValidation(app),
    postRegister(app),
  );
  router.post('/login', postLoginValidation(app), postLogin(app));
  router.post('/recover-password', recoverPassword(app));
  router.post('/reset-password', userVerificationValidation(app), resetPassword(app));
  router.post('/user-verification', userVerificationValidation(app), userVerification(app));
};

const {
  postLoginValidation,
  userVerificationValidation,
} = require('./auth.validations');
const {
  postLogin,
  recoverPassword,
  resetPassword,
  userVerification,
} = require('./auth.ctrl');

module.exports = async (app, router) => {
  router.post('/login', postLoginValidation(app), postLogin(app));
  router.post('/recover-password', recoverPassword(app));
  router.post('/reset-password', userVerificationValidation(app), resetPassword(app));
  router.post('/user-verification', userVerificationValidation(app), userVerification(app));
};

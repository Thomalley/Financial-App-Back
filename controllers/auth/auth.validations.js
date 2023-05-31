const {
  BAD_REQUEST,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');

const {
  registerSchema,
  loginSchema,
  verificationSchema,
} = require('./auth.schema');

const CONTROLLER = 'src/controllers/user/user.validations.js';
const FUNC_REGISTER_USER_VALIDATION = 'registerUserValidation()';
const FUNC_POST_LOGIN_VALIDATION = 'postLoginValidation()';
const FUNC_USER_VERIFICATION_VALIDATION = 'userVerificationValidation()';

const registerUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await registerSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_REGISTER_USER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator(res, BAD_REQUEST.status, { errorMessage: err.message });
    return;
  }

  next();
};

const postLoginValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await loginSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_POST_LOGIN_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator(res, BAD_REQUEST.status, { errorMessage: err.message });
    return;
  }

  next();
};

const userVerificationValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await verificationSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_USER_VERIFICATION_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator(res, BAD_REQUEST.status, { errorMessage: err.message });
    return;
  }

  next();
};

module.exports = {
  registerUserValidation,
  postLoginValidation,
  userVerificationValidation,
};

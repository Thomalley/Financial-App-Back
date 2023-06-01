const { BAD_REQUEST } = require('../../misc/const/http');

const { responseGenerator } = require('../../misc/utils/responseGenerator');

const {
  putUserSchema,
  getUserByIdSchema,
  registerSchema,
  loginSchema,
} = require('./user.schema');

const VALIDATION = 'src/controllers/user/user.validations.js';
const EDIT_USER_VALIDATION = 'putUserValidation()';
const GET_USER_BY_ID_VALIDATION = 'getUserByIdValidation()';
const REGISTER_USER_VALIDATION = 'registerUserValidation()';
const POST_LOGIN_VALIDATION = 'postLoginValidation()';

const registerUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await registerSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${VALIDATION}::${REGISTER_USER_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validación de datos ha fallado.', { errorMessage: err.message });
    return;
  }

  next();
};

const postLoginValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await loginSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${VALIDATION}::${POST_LOGIN_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validación de datos ha fallado.', { errorMessage: err.message });
    return;
  }

  next();
};

const putUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await putUserSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${VALIDATION}::${EDIT_USER_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validicación de datos ha fallado', { errorMessage: err.message });
    return;
  }

  next();
};

const getUserByIdValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getUserByIdSchema.validateAsync(req.params);
  } catch (err) {
    logger.warn(`${VALIDATION}::${GET_USER_BY_ID_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validicación de datos ha fallado', { errorMessage: err.message });
    return;
  }
  next();
};

module.exports = {
  putUserValidation,
  getUserByIdValidation,
  registerUserValidation,
  postLoginValidation,
};

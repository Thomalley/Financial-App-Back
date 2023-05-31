const {
  BAD_REQUEST,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');

const {
  putUserSchema,
  getUserByIdSchema,
} = require('./user.schema');

const CONTROLLER = 'src/controllers/user/user.validations.js';
const FUNC_EDIT_USER_VALIDATION = 'putUserValidation()';
const FUNC_GET_USER_BY_ID_VALIDATION = 'getUserByIdValidation()';

const putUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await putUserSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_EDIT_USER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator(res, BAD_REQUEST.status, { errorMessage: err.message });
    return;
  }

  next();
};

const getUserByIdValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getUserByIdSchema.validateAsync(req.params);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_GET_USER_BY_ID_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    responseGenerator(res, BAD_REQUEST.status, { errorMessage: err.message });
    return;
  }
  next();
};

module.exports = {
  putUserValidation,
  getUserByIdValidation,
};

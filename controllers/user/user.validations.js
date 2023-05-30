const {
  BAD_REQUEST,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');

const {
  updateUserSchema,
  getUsersPerPageSchema,
  getFilteredUsersSchema,
  createSchema,
  editUserSchema,
  getUserByIdSchema,
  getUserByRoleSchema,
} = require('./user.schema');

const CONTROLLER = 'src/controllers/user/user.validations.js';
const FUNC_PUT_USER_VALIDATION = 'putUserValidation()';
const FUNC_GET_USER_VALIDATION = 'getUsersPerPageValidation()';
const FUNC_GET_FILTERED_USER_VALIDATION = 'getFilteredUsersValidation()';
const FUNC_POST_CREATE_VALIDATION = 'createUserValidation()';
const FUNC_EDIT_USER_VALIDATION = 'editUserValidation()';
const FUNC_GET_USER_BY_ID_VALIDATION = 'getUserByIdValidation()';
const FUNC_GET_USERS_BY_ROLE_VALIDATION = 'getUsersByRoleValidation()';

const createUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await createSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_POST_CREATE_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }

  next();
};

const putUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await updateUserSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}:: ${FUNC_PUT_USER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }
  next();
};

const getUsersPerPageValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getUsersPerPageSchema.validateAsync(req.query);
  } catch (err) {
    logger.warn(`${CONTROLLER}:: ${FUNC_GET_USER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }
  next();
};

const getFilteredUsersValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getFilteredUsersSchema.validateAsync(req.query);
  } catch (err) {
    logger.warn(`${CONTROLLER}:: ${FUNC_GET_FILTERED_USER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }
  next();
};

const editUserValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await editUserSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_EDIT_USER_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
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
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }
  next();
};

const getUsersByRoleValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getUserByRoleSchema.validateAsync(req.params);
  } catch (err) {
    logger.warn(`${CONTROLLER}:: ${FUNC_GET_USERS_BY_ROLE_VALIDATION}: ${err.message}`, { ...req.params });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }
  next();
};

module.exports = {
  putUserValidation,
  getUsersPerPageValidation,
  getFilteredUsersValidation,
  createUserValidation,
  editUserValidation,
  getUserByIdValidation,
  getUsersByRoleValidation,
};

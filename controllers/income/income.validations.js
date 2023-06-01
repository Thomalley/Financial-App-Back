const { BAD_REQUEST, NOT_FOUND } = require('../../misc/const/http');

const { responseGenerator } = require('../../misc/utils/responseGenerator');

const {
  putIncomeSchema,
  getIncomeByIdSchema,
  postIncomeSchema,
  deleteIncomeSchema,
  getIncomesPerPageSchema,
} = require('./income.schema');
const { findIncomeById } = require('./income.services');

const VALIDATION = 'src/controllers/income/income.validations.js';
const GET_INCOME_VALIDATION = 'getIncomesPerPageValidation()';
const POST_CREATE_VALIDATION = 'postIncomeValidation()';
const PUT_INCOME_VALIDATION = 'putIncomeValidation()';
const GET_INCOME_BY_ID_VALIDATION = 'getIncomeByIdValidation()';
const DELETE_INCOME_VALIDATION = 'deleteIncomeValidation()';
const PUT_INCOME_BY_ID_VALIDATION = 'putIncomeValidation';

const postIncomeValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;
  try {
    await postIncomeSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${VALIDATION}::${POST_CREATE_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validicación de datos ha fallado', { errorMessage: err.message });
    return;
  }

  next();
};

const getIncomesPerPageValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getIncomesPerPageSchema.validateAsync(req.query);
  } catch (err) {
    logger.warn(`${VALIDATION}:: ${GET_INCOME_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validicación de datos ha fallado', { errorMessage: err.message });
    return;
  }
  next();
};

const putIncomeValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;
  const { id } = req.body;

  let income;
  try {
    income = await findIncomeById(app, id);
    if (!income) {
      logger.warn(`${VALIDATION}::${PUT_INCOME_BY_ID_VALIDATION}: Income does not exist or has been deleted`, { ...req.body });
      responseGenerator(res, NOT_FOUND.status, 'El ingreso que intentas modificar no existe.', { errorMessage: 'Income does not exist or has been deleted' });
      return;
    }
    await putIncomeSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${VALIDATION}::${PUT_INCOME_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validicación de datos ha fallado', { errorMessage: err.message });
    return;
  }

  res.locals.incomeToModify = income;
  next();
};

const getIncomeByIdValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getIncomeByIdSchema.validateAsync(req.params);
  } catch (err) {
    logger.warn(`${VALIDATION}::${GET_INCOME_BY_ID_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validicación de datos ha fallado', { errorMessage: err.message });
    return;
  }
  next();
};

const deleteIncomeValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await deleteIncomeSchema.validateAsync(req.params);
  } catch (err) {
    logger.warn(`${VALIDATION}::${DELETE_INCOME_VALIDATION}: ${err.message}`, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'La validicación de datos ha fallado', { errorMessage: err.message });
    return;
  }
  next();
};

module.exports = {
  getIncomesPerPageValidation,
  postIncomeValidation,
  putIncomeValidation,
  getIncomeByIdValidation,
  deleteIncomeValidation,
};

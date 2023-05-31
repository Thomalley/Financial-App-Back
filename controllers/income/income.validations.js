const {
  BAD_REQUEST,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');

const {
  putIncomeSchema,
  getIncomeByIdSchema,
  postIncomeSchema,
  deleteIncomeSchema,
  getIncomesPerPageSchema,
} = require('./income.schema');

const CONTROLLER = 'src/controllers/income/income.validations.js';
const FUNC_GET_INCOME_VALIDATION = 'getIncomesPerPageValidation()';
// const FUNC_GET_FILTERED_INCOME_VALIDATION = 'getFilteredIncomesValidation()';
const FUNC_POST_CREATE_VALIDATION = 'postIncomeValidation()';
const FUNC_PUT_INCOME_VALIDATION = 'putIncomeValidation()';
const FUNC_GET_INCOME_BY_ID_VALIDATION = 'getIncomeByIdValidation()';
const FUNC_DELETE_INCOME_VALIDATION = 'deleteIncomeValidation()';

const postIncomeValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;
  try {
    await postIncomeSchema.validateAsync(req.body);
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

const getIncomesPerPageValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getIncomesPerPageSchema.validateAsync(req.query);
  } catch (err) {
    logger.warn(`${CONTROLLER}:: ${FUNC_GET_INCOME_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }
  next();
};

// const getFilteredIncomesValidation = (app) => async (req, res, next) => {
//   const { logger } = app.locals;

//   try {
//     await getFilteredIncomesSchema.validateAsync(req.query);
//   } catch (err) {
//     logger.warn(`${CONTROLLER}:: ${FUNC_GET_FILTERED_INCOME_VALIDATION}: ${err.message}`, {
//       ...req.body,
//     });
//     res.status(BAD_REQUEST.status)
//       .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
//     return;
//   }
//   next();
// };

const putIncomeValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await putIncomeSchema.validateAsync(req.body);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_PUT_INCOME_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }

  next();
};

const getIncomeByIdValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await getIncomeByIdSchema.validateAsync(req.params);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_GET_INCOME_BY_ID_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
    return;
  }
  next();
};

const deleteIncomeValidation = (app) => async (req, res, next) => {
  const { logger } = app.locals;

  try {
    await deleteIncomeSchema.validateAsync(req.params);
  } catch (err) {
    logger.warn(`${CONTROLLER}::${FUNC_DELETE_INCOME_VALIDATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: err.message }));
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

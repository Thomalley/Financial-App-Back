const {
  INTERNAL_SERVER_ERROR, OK, NOT_FOUND, CREATED, NO_CONTENT,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');

const {
  findIncomeById,
  editIncome,
  createNewIncome,
  eraseIncome,
  findFilteredIncome,
  findIncomePerPage,
} = require('./income.services');

const CONTROLLER = 'src/controllers/income/income.ctrl.js';
const FUNC_GET_INCOME_BY_ID = 'getIncomeById()';
const FUNC_EDIT_INCOME = 'editIncome()';
const FUNC_POST_INCOME = 'postIncom()';
const FUNC_DELETE_INCOME = 'deleteIncome()';
const FUNC_GET_INCOME_PER_PAGE = 'getIncomePerPage()';

const postIncome = (app) => async (req, res) => {
  const { logger } = app.locals;

  const {
    category,
    amount,
    date,
    used,
    description,
    currency,
  } = req.body;

  const { requestIncome } = res.locals;

  let income = null;
  try {
    income = await createNewIncome(app, {
      category,
      amount,
      date,
      used,
      description,
      currency,
      incomeId: requestIncome.id,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_INCOME}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }

  res.status(CREATED.status)
    .json(responseGenerator(CREATED.status, { income }));
};

const getIncomeById = (app) => async (req, res) => {
  const { logger } = app.locals;

  const { id } = req.params;

  let income = null;
  try {
    income = await findIncomeById(app, id);
    if (!income) {
      logger.warn(`${CONTROLLER}::${FUNC_GET_INCOME_BY_ID}: Income does not exist`, {
        ...req.body,
      });
      res.status(NOT_FOUND.status)
        .json(responseGenerator(NOT_FOUND.status, { errorMessage: 'Income does not exist or has been deleted' }));
      return;
    }
    res.status(OK.status)
      .json(responseGenerator(OK.status, { income }));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_INCOME_BY_ID}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const putIncome = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    id,
    category,
    amount,
    date,
    used,
    description,
    currency,
  } = req.body;

  // Edit income
  let income = null;
  try {
    income = await editIncome(app, {
      id,
      category,
      amount,
      date,
      used,
      description,
      currency,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_EDIT_INCOME}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }
  res.status(OK.status)
    .json(responseGenerator(OK.status, { income }));
};

const deleteIncome = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { incomesIds } = req.body;

  try {
    await eraseIncome(app, incomesIds);
    res.status(OK.status).json(responseGenerator(OK.status));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_DELETE_INCOME}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const getIncomePerPage = (app) => async (req, res) => {
  const { db, logger } = app.locals;

  const {
    limit, page, searchValue, sort,
  } = req.query;

  try {
    let income;

    const [orderBy, order] = sort.split('|');

    if (!db.income.rawAttributes[orderBy]) {
      logger.error(`${CONTROLLER}::${FUNC_GET_INCOME_PER_PAGE}: Sort attribute does not exist`);
      res.status(INTERNAL_SERVER_ERROR.status)
        .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: 'Sort attribute does not exist' }));
      return;
    }

    if (searchValue) {
      income = await findFilteredIncome(app, {
        limit, page, searchValue, orderBy, order,
      });
    } else {
      income = await findIncomePerPage(app, {
        limit, page, orderBy, order,
      });
    }

    if (!income.rows.length) {
      res.status(OK.status)
        .json(responseGenerator(NO_CONTENT.status, {
          income: [],
          totalIncome: 0,
        }));
      return;
    }
    res.status(OK.status)
      .json(responseGenerator(OK.status, {
        income: income.rows,
        totalIncome: income.count,
      }));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_INCOME_PER_PAGE}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};
// const deleteIncome = (app) => async (req, res) => {
//   const { logger } = app.locals;
//   const { id } = req.params;

//   try {
//     await deleteIncomeById(app, { id });

//     res.status(OK.status).json(responseGenerator(OK.status));
//   } catch (err) {
//     logger.error(`${CONTROLLER}::${FUNC_DELETE_INCOME}: ${err.message}`, {
//       ...req.body,
//     });
//     res.status(INTERNAL_SERVER_ERROR.status)
//       .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
//   }
// };

module.exports = {
  getIncomeById,
  putIncome,
  postIncome,
  deleteIncome,
  getIncomePerPage,
};

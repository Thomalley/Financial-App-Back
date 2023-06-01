const {
  INTERNAL_SERVER_ERROR, OK, NOT_FOUND, CREATED,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/responseGenerator');

const {
  findIncomeById,
  editIncome,
  createNewIncome,
  eraseIncome,
  findIncomesPerPage,
} = require('./income.services');

const CONTROLLER = 'src/controllers/income/income.ctrl.js';
const GET_INCOME_BY_ID = 'getIncomeById()';
const EDIT_INCOME = 'editIncome()';
const POST_INCOME = 'postIncom()';
const DELETE_INCOME = 'deleteIncome()';
const GET_INCOME_PER_PAGE = 'getIncomePerPage()';

const postIncome = (app) => async (req, res) => {
  const { logger } = app.locals;

  const {
    category,
    amount,
    date,
    description,
    currency,
  } = req.body;

  const { requestUser } = res.locals;

  let income = null;
  try {
    income = await createNewIncome(app, {
      category,
      amount,
      date,
      description,
      currency,
      userId: requestUser.id,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${POST_INCOME}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'No se pudo crear el ingreso', { errorMessage: err.message });
    return;
  }
  responseGenerator(res, CREATED.status, 'Ingreso registrado exitosamente.', { income });
};

const getIncomeById = (app) => async (req, res) => {
  const { logger } = app.locals;

  const { id } = req.params;

  let income = null;
  try {
    income = await findIncomeById(app, id);
    if (!income) {
      logger.warn(`${CONTROLLER}::${GET_INCOME_BY_ID}: El ingreso no existe`, { ...req.body });
      responseGenerator(res, NOT_FOUND.status, { errorMessage: 'El ingreso no existe o fue eliminado' });
      return;
    }
    responseGenerator(res, OK.status, 'Ingreso encontrado con éxito', { income });
  } catch (err) {
    logger.error(`${CONTROLLER}::${GET_INCOME_BY_ID}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor', { errorMessage: err.message });
  }
};

const putIncome = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { incomeToModify } = res.locals;
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
    income = await editIncome({
      id,
      category,
      amount,
      date,
      used,
      description,
      currency,
    }, incomeToModify);
  } catch (err) {
    logger.error(`${CONTROLLER}::${EDIT_INCOME}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error al intentar editar el ingreso', { errorMessage: err.message });
    return;
  }
  responseGenerator(res, OK.status, 'Su ingreso fue editado exitosamente', { income });
};

const deleteIncome = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { incomesIds } = req.body;

  try {
    await eraseIncome(app, incomesIds);
    responseGenerator(res, OK.status, 'Su ingreso ha sido borrado exitosamente', {});
  } catch (err) {
    logger.error(`${CONTROLLER}::${DELETE_INCOME}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Ha ocurrido un error para borrar su ingreso', { errorMessage: err.message });
  }
};

const getIncomePerPage = (app) => async (req, res) => {
  const { logger } = app.locals;

  const {
    limit, page, category, date, currency,
  } = req.query;

  try {
    const income = await findIncomesPerPage(app, {
      limit, page, category, date, currency,
    });

    if (!income.rows.length) {
      responseGenerator(res, OK.status, 'No se encontraron ingresos con estos parámetros', {
        income: [],
        totalIncome: 0,
      });
      return;
    }

    responseGenerator(res, OK.status, 'Ingresos encontrados con estos parámetros exitosamente', {
      income: income.rows,
      totalIncome: income.count,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${GET_INCOME_PER_PAGE}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor', { errorMessage: err.message });
  }
};

module.exports = {
  getIncomeById,
  putIncome,
  postIncome,
  deleteIncome,
  getIncomePerPage,
};

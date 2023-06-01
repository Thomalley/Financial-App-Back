const { isAuthorized } = require('../auth/auth.middlewares');
const {
  postIncome,
  putIncome,
  deleteIncome,
  getIncomeById,
  getIncomePerPage,
} = require('./income.ctrl');

const {
  postIncomeValidation,
  putIncomeValidation,
  deleteIncomeValidation,
  getIncomeByIdValidation,
  getIncomesPerPageValidation,
} = require('./income.validations');

module.exports = (app, router) => {
  router.post(
    '/income/create',
    isAuthorized(),
    postIncomeValidation(app),
    postIncome(app),
  );

  router.put(
    '/income/edit',
    isAuthorized(),
    putIncomeValidation(app),
    putIncome(app),
  );

  router.put(
    '/income/delete',
    isAuthorized(),
    deleteIncomeValidation(app),
    deleteIncome(app),
  );

  router.get(
    '/income/:id',
    isAuthorized(),
    getIncomeByIdValidation(app),
    getIncomeById(app),
  );

  router.get(
    'incomes',
    isAuthorized(),
    getIncomesPerPageValidation(app),
    getIncomePerPage(app),
  );
};

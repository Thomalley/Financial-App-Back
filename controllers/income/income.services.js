const findIncomeById = async (app, { id }) => {
  const { db } = app.locals;

  const income = await db.income.findOne({
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  return income;
};

const editIncome = async (
  {
    id,
    category,
    amount,
    date,
    used,
    description,
    currency,
  },
  incomeToModify,
) => {
  if (incomeToModify) {
    const upToUpdate = {
      id,
      category,
      amount,
      date,
      used,
      description,
      currency,
    };
    await incomeToModify.update(upToUpdate);
  }

  return incomeToModify;
};

const createNewIncome = async (app, {
  category,
  amount,
  date,
  description,
  currency,
  userId,
}) => {
  const { db } = app.locals;

  const income = await db.income.create({
    category,
    amount,
    date,
    used: false,
    description,
    currency,
    userId,
  });
  return income;
};

const eraseIncome = async (app, incomesIds) => {
  const { db } = app.locals;

  const deleteIncomesQuery = `UPDATE "incomes" SET is_deleted=true WHERE id IN (${incomesIds.map((p) => `${p}`).join(',')})`;
  await db.sequelize.query(deleteIncomesQuery);
};

const findIncomesPerPage = async (app, {
  limit,
  page,
  category,
  date,
  currency,
}) => {
  const { db } = app.locals;
  const where = { used: false };

  if (category) where.category = category;
  if (date) where.date = date;
  if (currency) where.currency = currency;

  const searchQuery = {
    where,
    attributes: ['id', 'userId', 'category', 'amount', 'date', 'description', 'currency'],
    order: [['createdAt', 'DESC'], ['id', 'ASC']],
  };

  if (limit && page) {
    searchQuery.offset = limit * page;
    searchQuery.limit = Number.parseInt(limit, 10);
  }

  const income = await db.income.findAndCountAll(searchQuery);

  return income;
};

module.exports = {
  findIncomeById,
  editIncome,
  createNewIncome,
  eraseIncome,
  findIncomesPerPage,
};

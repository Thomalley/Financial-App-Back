const sequelize = require('sequelize');

const op = sequelize.Op;

const findIncomeById = async (app, {
  id,
}) => {
  const { db } = app.locals;

  const income = await db.income.findOne({
    where: {
      id,
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  return income;
};

const editIncome = async (
  app,
  {
    id,
    category,
    amount,
    date,
    used,
    description,
    currency,
  },
) => {
  const { db } = app.locals;

  const income = await db.income.findByPk(id);

  if (income) {
    const upToUpdate = {
      id,
      category,
      amount,
      date,
      used,
      description,
      currency,
    };
    await income.update(upToUpdate);
  }

  return income;
};

const createNewIncome = async (app, {
  category,
  amount,
  date,
  used,
  description,
  currency,
  userId,
}) => {
  const { db } = app.locals;

  const income = await db.income.create({
    category,
    amount,
    date,
    used,
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

const findIncomePerPage = async (app, {
  limit,
  page,
  orderBy,
  order,
}) => {
  const { db } = app.locals;

  const income = await db.income.findAndCountAll({
    order: [
      [orderBy, order],
    ],
    offset: limit * page,
    limit: Number.parseInt(limit, 10),
  });

  return income;
};

const findFilteredIncome = async (app, {
  limit,
  page,
  searchValue,
  orderBy,
  order,
}) => {
  const { db } = app.locals;

  const income = await db.income.findAndCountAll({
    where: {
      [op.or]: {
        name: {
          [op.iLike]: `%${searchValue}%`,
        },
        lastname: {
          [op.iLike]: `%${searchValue}%`,
        },
        email: {
          [op.iLike]: `%${searchValue}%`,
        },
      },
    },
    order: [
      [orderBy, order],
    ],
    attributes: ['id', 'name', 'lastname', 'email', 'role', 'active', 'updated_at'],
    offset: limit * page,
    limit: Number.parseInt(limit, 10),
  });

  return income;
};
module.exports = {
  findIncomeById,
  editIncome,
  createNewIncome,
  eraseIncome,
  findIncomePerPage,
  findFilteredIncome,
};

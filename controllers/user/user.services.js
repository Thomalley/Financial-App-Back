const findUserById = async (app, { id }) => {
  const { db } = app.locals;

  const user = await db.user.findOne({
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  return user;
};

const createNewUser = async (app, {
  email,
  name,
  lastname,
  password,
}) => {
  const { db } = app.locals;

  const user = await db.user.create({
    email,
    name,
    lastname,
    password,
  });

  return user;
};

const editUser = async (
  app,
  {
    id, active, name, lastname, email, deleted,
  },
) => {
  const { db } = app.locals;

  const user = await db.user.findByPk(id);

  if (user) {
    const upToUpdate = {
      id,
      active,
      name,
      lastname,
      email,
      deleted,
    };
    await user.update(upToUpdate);
  }

  return user;
};

const findUserByEmail = async (app, { email }) => {
  const { db } = app.locals;

  const user = await db.user.findOne({ where: { email } });
  return user;
};

module.exports = {
  findUserById,
  editUser,
  findUserByEmail,
  createNewUser,
};

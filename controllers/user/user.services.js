const findUserById = async (app, {
  id,
}) => {
  const { db } = app.locals;

  const user = await db.user.findOne({
    where: {
      id,
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  return user;
};

const editUser = async (
  app,
  {
    id, active, name, lastname, email, roleId, phone, country,
  },
) => {
  const { db } = app.locals;

  const user = await db.user.findByPk(id);

  if (user) {
    const upToUpdate = {
      active,
      name,
      lastname,
      email,
      roleId,
      phone,
      country,
    };
    await user.update(upToUpdate);
  }

  return user;
};

module.exports = {
  findUserById,
  editUser,
};

const findUser = async (app, {
  email,
}) => {
  const { db } = app.locals;

  const user = await db.user.findOne({
    where: {
      email,
    },
    include: [
      {
        model: db.developer,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: db.role,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: db.company,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  return user;
};

const createNewUser = async (app, {
  email,
  name,
  lastname,
  password,
  roleId,
  userTokenVerification,
  phone,
  country,
}) => {
  const { db } = app.locals;

  const user = await db.user.create({
    email,
    name,
    lastname,
    password,
    roleId,
    userTokenVerification,
    phone,
    country,
  });

  return user;
};

const findUserToken = async (app, {
  token,
}) => {
  const { db } = app.locals;

  const user = await db.user.findOne({
    where: {
      resetPasswordToken: token,
    },
  });

  return user;
};

const findUserByVerificationToken = async (app, {
  token,
}) => {
  const { db } = app.locals;

  const user = await db.user.findOne({
    where: {
      userTokenVerification: token,
    },
  });

  return user;
};

module.exports = {
  findUser,
  createNewUser,
  findUserToken,
  findUserByVerificationToken,
};

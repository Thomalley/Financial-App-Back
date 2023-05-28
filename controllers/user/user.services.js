const sequelize = require('sequelize');
const { SUPER_ADMIN } = require('../../misc/const/user_types');

const op = sequelize.Op;

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
      },
    ],
  });

  return user;
};

const createNewUser = async (app, {
  name,
  lastname,
  email,
  password,
  roleId,
  phone,
  country,
}) => {
  const { db } = app.locals;

  const user = await db.user.create({
    name,
    lastname,
    email,
    password,
    roleId,
    phone,
    country,
  });

  return user;
};

const findUserById = async (app, {
  id,
}) => {
  const { db } = app.locals;

  const user = await db.user.findOne({
    where: {
      id,
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: db.role,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: db.developer,
        attributes: ['id', 'contractStartDate'],
      },
    ],
  });

  return user;
};

const findUsersPerPage = async (app, {
  limit,
  page,
  searchValue,
  user,
}) => {
  const { db } = app.locals;
  const { name } = user.role;

  const adminRole = await db.role.findOne({ where: { name: SUPER_ADMIN }, attributes: ['id'], raw: true });
  const columns = ['name', 'lastname', 'email', 'phone', 'country'];
  const conditions = columns.map((c) => ({
    [c]: {
      [op.iLike]: `%${searchValue}%`,
    },
  }));

  const where = {
    [op.or]: conditions,
  };

  if (name !== SUPER_ADMIN) {
    where.roleId = { [op.not]: adminRole.id };
  }

  const users = await db.user.findAndCountAll({
    where,
    order: [
      ['name', 'ASC'],
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    include: {
      model: db.role,
    },
    offset: limit * page,
    limit: Number.parseInt(limit, 10),
  });

  return users;
};

const updateUser = async (app, {
  id,
  updatedStatus,
  updatedRole,
}) => {
  const { db } = app.locals;

  const user = await db.user.findByPk(id);

  if (user) {
    // Hash password
    const upToUpdate = {
      active: updatedStatus,
      roleId: updatedRole,
    };

    await user.update(upToUpdate);
  }

  return user;
};

const deleteUserById = async (app, { id }) => {
  const { db } = app.locals;

  const response = await db.user.destroy({
    where: {
      id,
    },
  });

  return response;
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

const findAllUsers = async (app) => {
  const { db } = app.locals;

  const users = await db.user.findAll({
    include: { model: db.developer, attributes: ['jobTitle'] },
  });

  return users;
};

const findActiveUsersPerPage = async (app, {
  limit,
  page,
  searchValue,
  condition,
  user,
  filterDimensionIds,
  requiredExperience,
}) => {
  const { db } = app.locals;
  const { name } = user.role;

  let finalUsers;

  const columns = ['name', 'lastname'];
  const conditions = columns.map((c) => ({
    [c]: {
      [op.iLike]: `%${searchValue}%`,
    },
  }));

  const limitAndOffset = {};
  if (condition === 'withHelpers') {
    limitAndOffset.offset = searchValue !== '' ? 0 : limit * page;
    limitAndOffset.limit = Number.parseInt(limit, 10);
  }

  const adminRole = await db.role.findOne({ where: { name: SUPER_ADMIN }, attributes: ['id'], raw: true });

  const where = {
    active: true,
    [op.or]: conditions,
  };
  if (name !== SUPER_ADMIN) {
    where.roleId = { [op.not]: adminRole.id };
  }

  const users = await db.user.findAll({
    attributes: ['id', 'name', 'lastname', 'email'],
    include: {
      model: db.developer,
      attributes: ['id', 'clockify_id'],
      required: true,
      include: [{
        model: db.help,
        required: condition === 'needHelp' || condition === 'withHelpers',
        include: {
          model: db.helper,
          attributes: ['developer_id'],
          include: {
            model: db.developer,
            attributes: ['user_id'],
            include: {
              model: db.user,
              attributes: ['name', 'lastname'],
            },
          },
          required: condition === 'withHelpers',
        },
        where: {
          active: true,
        },
      }],
    },
    where,
    ...limitAndOffset,
  });

  if (filterDimensionIds && filterDimensionIds.length > 0) {
    const filteredUsers = await db.developer_dimension.findAll({
      where: {
        dimensionId: filterDimensionIds,
        experience: { [op.gte]: requiredExperience },
      },
      attributes: ['dimensionId', 'experience'],
      include: [{
        model: db.developer,
        attributes: ['id', 'userId'],
      }],
    });

    const filteredUsersIds = filteredUsers.map((item) => item.developer.userId);

    finalUsers = users.filter((item) => filteredUsersIds.includes(item.id));
  } else {
    finalUsers = users;
  }

  if (condition === 'users') {
    if (limit * page >= users.length) {
      return [];
    }

    const usersOk = [];
    for (let i = limit * page; i < users.length; i += 1) {
      if (usersOk.length < limit
        && (!users[i].developer.help || !users[i].developer.help.length)) {
        usersOk.push(users[i]);
      }
    }

    finalUsers = usersOk;
  } else if (condition === 'needHelp') {
    if (limit * page >= users.length) {
      return [];
    }

    const usersNeedHelp = [];
    for (let i = limit * page; i < users.length; i += 1) {
      if (usersNeedHelp.length < limit
        && (!users[i].developer.help[0].helpers || !users[i].developer.help[0].helpers.length)) {
        usersNeedHelp.push(users[i]);
      }
    }

    finalUsers = usersNeedHelp;
  }
  return finalUsers;
};

const findAllFilteredUsers = async (app, {
  filterDimensionIds,
  requiredExperience,
}) => {
  const { db } = app.locals;

  const filteredUsers = await db.developer_dimension.findAll({
    where: {
      dimensionId: filterDimensionIds,
      experience: { [op.gte]: requiredExperience },
    },
    attributes: ['dimensionId', 'experience'],
    include: [{
      model: db.developer,
      attributes: ['id', 'userId'],
    }],
  });

  return filteredUsers;
};

const findFilteredUsers = async (app, usersEmails) => {
  const { db } = app.locals;

  const users = await db.user.findAll({
    where: {
      email: {
        [op.notIn]: usersEmails,
      },
      active: true,
    },
    attributes: ['email'],
    include: {
      model: db.developer,
    },
  });

  return users;
};

const findUsersByRole = async (app, { roleId }) => {
  const { db } = app.locals;

  const users = await db.user.findAll({
    where: { roleId, active: true },
    attributes: ['id', 'name', 'lastname'],
    include: [{
      model: db.developer,
      required: true,
      attributes: ['id'],
    }],
  });

  return users;
};

module.exports = {
  findUser,
  findUserById,
  createNewUser,
  findUsersPerPage,
  updateUser,
  deleteUserById,
  editUser,
  findAllUsers,
  findActiveUsersPerPage,
  findAllFilteredUsers,
  findFilteredUsers,
  findUsersByRole,
};

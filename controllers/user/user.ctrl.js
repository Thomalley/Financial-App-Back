const {
  INTERNAL_SERVER_ERROR, NO_CONTENT, OK, NOT_FOUND, CONFLICT, CREATED,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');
const { verify } = require('../../misc/utils/jwt');

const {
  findUserById,
  findUsersPerPage,
  deleteUserById,
  findUser,
  createNewUser,
  editUser,
  findAllUsers,
  findActiveUsersPerPage,
  findAllFilteredUsers,
  findUsersByRole,
} = require('./user.services');

const CONTROLLER = 'src/controllers/user/user.ctrl.js';
const FUNC_GET_USERS_PAGE = 'getUsersPerPage()';
const FUNC_GET_USER = 'getCurrentUser()';
const FUNC_GET_USER_BY_ID = 'getUserById()';
const FUNC_DELETE_USER = 'deleteUser()';
const FUNC_POST_CREATE_USER = 'postCreateUser';
const FUNC_PUT_EDIT_USER = 'putEditUser()';
const FUNC_GET_ALL_USERS = 'getAllUsers()';
const FUNC_GET_FILTERED_USERS = 'getFilteredUsers()';
const FUNC_GET_USERS_BY_ROLA = 'getUsersByRole()';

const postCreateUser = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    name,
    lastname,
    email,
    password,
    roleId,
    phone,
    country,
  } = req.body;

  let existingUser = null;
  try {
    existingUser = await findUser(app, { email: email.toLowerCase() });
    if (existingUser) {
      logger.warn(`${CONTROLLER}::${FUNC_POST_CREATE_USER}: User already exists`, {
        ...req.body,
      });
      res.status(CONFLICT.status)
        .json(responseGenerator(CONFLICT.status, { errorMessage: 'User already exists' }));
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_CREATE_USER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }

  // Create new User
  let user = null;
  try {
    user = await createNewUser(app, {
      name,
      lastname,
      email: email.toLowerCase(),
      password,
      roleId,
      phone,
      country,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_CREATE_USER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }
  res.status(CREATED.status)
    .json(responseGenerator(CREATED.status, { user }));
};

const getUsersPerPage = (app) => async (req, res) => {
  const { logger } = app.locals;
  const userToken = req.headers['x-user-token'];
  const userData = await verify(userToken);
  const { user } = userData.result;

  const {
    limit, page, searchValue,
  } = req.query;

  try {
    const users = await findUsersPerPage(app, {
      limit, page, searchValue, user,
    });

    if (!users.rows.length) {
      res.status(OK.status)
        .json(responseGenerator(NO_CONTENT.status, {
          users: [],
          totalUsers: 0,
        }));
      return;
    }
    res.status(OK.status)
      .json(responseGenerator(OK.status, {
        users: users.rows,
        totalUsers: users.count,
      }));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USERS_PAGE}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const getCurrentUser = (app) => async (req, res) => {
  const { logger } = app.locals;

  const userToken = req.headers['x-user-token'];
  const userData = await verify(userToken);
  const { user } = userData.result;

  // Find user
  let userInfo = null;
  try {
    userInfo = await findUserById(app, { id: user.id });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_GET_USER}: User does not exist`, {
        ...req.body,
      });
      res.status(NOT_FOUND.status)
        .json(responseGenerator(NOT_FOUND.status, { errorMessage: 'User does not exist or has been deleted' }));
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }

  res.status(OK.status)
    .json(responseGenerator(OK.status, { user: userInfo }));
};

const getUserById = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const { id } = req.params;

  // Find user
  let user = null;
  try {
    user = await findUserById(app, { id });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_GET_USER_BY_ID}: User does not exist`, {
        ...req.body,
      });
      res.status(NOT_FOUND.status)
        .json(responseGenerator(NOT_FOUND.status, { errorMessage: 'User does not exist or has been deleted' }));
      return;
    }
    res.status(OK.status)
      .json(responseGenerator(OK.status, { user }));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USER_BY_ID}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const deleteUser = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { id } = req.params;

  try {
    await deleteUserById(app, { id });

    res.status(OK.status).json(responseGenerator(OK.status));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_DELETE_USER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const putEditUser = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    id,
    active,
    name,
    lastname,
    email,
    roleId,
    phone,
    country,
  } = req.body;

  // Edit user
  let user = null;
  try {
    user = await editUser(app, {
      id,
      active,
      name,
      lastname,
      email: email.toLowerCase(),
      roleId,
      phone,
      country,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_PUT_EDIT_USER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }
  res.status(OK.status)
    .json(responseGenerator(OK.status, { user }));
};

const getAllUsers = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Find users
  let users = null;
  try {
    users = await findAllUsers(app);
    if (!users) {
      logger.warn(`${CONTROLLER}::${FUNC_GET_ALL_USERS}: Users does not exist`, {
        ...req.body,
      });
      res.status(NOT_FOUND.status)
        .json(responseGenerator(NOT_FOUND.status, { errorMessage: 'Users does not exist or has been deleted' }));
      return;
    }
    res.status(OK.status)
      .json(responseGenerator(OK.status, { users }));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_ALL_USERS}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const getActiveUsers = (app) => async (req, res) => {
  const { logger } = app.locals;
  const userToken = req.headers['x-user-token'];
  const userData = await verify(userToken);
  const { user } = userData.result;

  const {
    limit, page, searchValue, condition, query, requiredExperience,
  } = req.query;

  try {
    const users = await findActiveUsersPerPage(app, {
      limit,
      page,
      searchValue,
      condition,
      user,
      filterDimensionIds: JSON.parse(query),
      requiredExperience,
    });

    res.status(OK.status)
      .json(responseGenerator(OK.status, { users }));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USERS_PAGE}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const getFilteredUsers = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { query, requiredExperience } = req.query;

  try {
    const users = await findAllFilteredUsers(app, {
      filterDimensionIds: JSON.parse(query),
      requiredExperience,
    });

    res.status(OK.status)
      .json(responseGenerator(OK.status, { users }));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_FILTERED_USERS}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const getUsersByRole = (app) => async (req, res) => {
  const { logger } = app.locals;
  const { roleId } = req.params;

  try {
    const users = await findUsersByRole(app, { roleId });

    if (users) {
      res.status(OK.status).json(responseGenerator(OK.status, { users }));
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USERS_BY_ROLA}: ${err.message}`, { ...req.body });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

module.exports = {
  getUsersPerPage,
  getCurrentUser,
  deleteUser,
  getUserById,
  postCreateUser,
  putEditUser,
  getAllUsers,
  getActiveUsers,
  getFilteredUsers,
  getUsersByRole,
};

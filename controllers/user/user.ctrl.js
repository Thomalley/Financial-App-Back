const {
  INTERNAL_SERVER_ERROR, OK, NOT_FOUND,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');

const {
  findUserById,
  editUser,
} = require('./user.services');

const CONTROLLER = 'src/controllers/user/user.ctrl.js';
const FUNC_GET_USER_BY_ID = 'getUserById()';
const FUNC_EDIT_USER = 'editUser()';

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

const putUser = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    id,
    active,
    name,
    lastname,
    email,
    deleted,

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
      deleted,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_EDIT_USER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }
  res.status(OK.status)
    .json(responseGenerator(OK.status, { user }));
};

// const deleteUser = (app) => async (req, res) => {
//   const { logger } = app.locals;
//   const { id } = req.params;

//   try {
//     await deleteUserById(app, { id });

//     res.status(OK.status).json(responseGenerator(OK.status));
//   } catch (err) {
//     logger.error(`${CONTROLLER}::${FUNC_DELETE_USER}: ${err.message}`, {
//       ...req.body,
//     });
//     res.status(INTERNAL_SERVER_ERROR.status)
//       .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
//   }
// };

module.exports = {
  getUserById,
  putUser,
};

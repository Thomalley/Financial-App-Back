const {
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
} = require('./user.ctrl');

const {
  getUsersPerPageValidation,
  postCreateValidation,
  getFilteredUsersValidation,
  putEditUserValidation,
  getUserByIdValidation,
  getUsersByRoleValidation,
} = require('./user.validations');

const { isAuthorized } = require('../auth/auth.middlewares');

module.exports = (app, router) => {
  router.post(
    '/users/create',
    isAuthorized(),
    postCreateValidation(app),
    postCreateUser(app),
  );
  router.get(
    '/users',
    isAuthorized(),
    getUsersPerPageValidation(app),
    getUsersPerPage(app),
  );
  router.get(
    '/all/users',
    isAuthorized(),
    getAllUsers(app),
  );
  router.get('/users/active', getUsersPerPageValidation(app), getActiveUsers(app));
  router.get('/user', isAuthorized(), getCurrentUser(app));
  router.get('/users/filter', getFilteredUsersValidation(app), getFilteredUsers(app));
  router.get('/users/:id', getUserByIdValidation(app), getUserById(app));
  router.delete('/user/:id', isAuthorized(), deleteUser(app));
  router.put('/user/edit', isAuthorized(), putEditUserValidation(app), putEditUser(app));
  router.get('/users/role/:roleId', getUsersByRoleValidation(app), getUsersByRole(app));
};

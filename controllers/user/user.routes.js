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

const controllerName = 'user';

module.exports = (app, router) => {
  router.post(
    '/users/create',
    isAuthorized(app, controllerName),
    postCreateValidation(app),
    postCreateUser(app),
  );
  router.get(
    '/users',
    isAuthorized(app, controllerName),
    getUsersPerPageValidation(app),
    getUsersPerPage(app),
  );
  router.get(
    '/all/users',
    isAuthorized(app, controllerName),
    getAllUsers(app),
  );
  router.get('/users/active', getUsersPerPageValidation(app), getActiveUsers(app));
  router.get('/user', isAuthorized(app, controllerName), getCurrentUser(app));
  router.get('/users/filter', getFilteredUsersValidation(app), getFilteredUsers(app));
  router.get('/users/:id', getUserByIdValidation(app), getUserById(app));
  router.delete('/user/:id', isAuthorized(app, controllerName), deleteUser(app));
  router.put('/user/edit', isAuthorized(app, controllerName), putEditUserValidation(app), putEditUser(app));
  router.get('/users/role/:roleId', getUsersByRoleValidation(app), getUsersByRole(app));
};

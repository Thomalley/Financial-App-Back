const { UNAUTHORIZED, FORBIDDEN, INTERNAL_SERVER_ERROR } = require('../../misc/const/http');
const { responseGenerator } = require('../../misc/utils/http');
const { verify } = require('../../misc/utils/jwt');
const { SUPER_ADMIN, SYSTEM_ADMIN } = require('../../misc/const/user_types');

const FUNC_AUTH = 'isAuthorized()';

// Obtain role crud permissions
const getRole = async (db, roleId) => {
  const role = await db.role.findOne({
    where: {
      id: roleId,
    },
    include: [{
      model: db.group,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      as: 'groups',
    }],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!role) return null;
  return role;
};

const isAuthorized = (app, permission, group) => async (req, res, next) => {
  const bearerHeader = req.headers.authorization || null;
  const { db, logger } = app.locals;
  if (!bearerHeader) {
    res
      .status(UNAUTHORIZED.status)
      .json(
        responseGenerator(UNAUTHORIZED.status, {
          errorMessage: 'Autenticacion fallida',
        }),
      );
    return;
  }
  const token = bearerHeader.split(' ')[1];
  const userToken = req.headers['x-user-token'];

  const isValid = await verify(token);
  if (!isValid.success) {
    res.status(UNAUTHORIZED.status)
      .json(responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Autenticacion fallida' }));
    return;
  }
  const userData = await verify(userToken);
  if (!userData.success) {
    res.status(UNAUTHORIZED.status)
      .json(responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Autenticacion fallida' }));
    return;
  }

  const { user } = userData.result;
  try {
    const role = user.role ? await getRole(db, user.role.id) : null;
    // If the role or group doesn't exists or miss match, return 403.
    if (!role) {
      res.status(FORBIDDEN.status).json(
        responseGenerator(
          FORBIDDEN.status,
          { errorMessage: 'No perteneces al grupo de esta sección' },
        ),
      );
      return;
    }
    const getGroup = role.groups.find((g) => g.name === group);

    const authorized = role.name === SUPER_ADMIN
      || role.name === SYSTEM_ADMIN
      || (getGroup ? getGroup.group_role[permission] : false);
    if (!authorized) {
      res.status(FORBIDDEN.status).json(
        responseGenerator(
          FORBIDDEN.status,
          { errorMessage: 'No tienes permisos para ejecutar esta acción' },
        ),
      );
      return;
    }
    res.locals.requestUser = user;
    next();
  } catch (error) {
    logger.warn(`${FUNC_AUTH}: ${error.message || 'Error while getting auth'}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status).json(
      responseGenerator(
        INTERNAL_SERVER_ERROR.status,
        { errorMessage: 'Error al obtener la autorización' },
      ),
    );
  }
};

const isAuthorizedPublic = () => async (req, res, next) => {
  const bearerHeader = req.headers.authorization || null;
  if (!bearerHeader) {
    res.status(UNAUTHORIZED.status)
      .json(responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Autenticacion fallida' }));
    return;
  }
  const token = bearerHeader.split(' ')[1];

  const isValid = await verify(token);
  if (!isValid.success) {
    res.status(UNAUTHORIZED.status)
      .json(responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Autenticacion fallida' }));
    return;
  }
  next();
};

module.exports = {
  isAuthorized,
  isAuthorizedPublic,
};

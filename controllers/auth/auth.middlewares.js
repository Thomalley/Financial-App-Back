const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../../misc/const/http');
const { responseGenerator } = require('../../misc/utils/http');

const isAuthorized = (app, roles) => async (req, res, next) => {
  const bearerHeader = req.headers.authorization || null;
  if (!bearerHeader) {
    const message = 'Usuario no autorizado para hacer esta llamada.';
    responseGenerator(res, UNAUTHORIZED.status, message);
    next(message);
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, data) => {
    if (err) {
      const message = 'Token no es válido.';
      responseGenerator(res, UNAUTHORIZED.status, message);
      next(message);
    }
    // If the user's role is one of those in the array, the route can be used.
    const authorized = roles.includes(data.user.role);

    // If the user's role is not in the allowed array, the response is UNAUTHORIZED.
    if (!authorized) {
      responseGenerator(res, UNAUTHORIZED.status, 'Usuario no autorizado para acceder a este recurso.');
      return;
    }
    // eslint-disable-next-line no-param-reassign
    res.locals.requestUser = data.user;
    next();
  });
};

module.exports = {
  isAuthorized,
};

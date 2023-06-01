const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../../misc/const/http');
const { responseGenerator } = require('../../misc/utils/responseGenerator');

const isAuthorized = () => async (req, res, next) => {
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
    // eslint-disable-next-line no-param-reassign
    res.locals.requestUser = data.user;
    next();
  });
};

module.exports = {
  isAuthorized,
};

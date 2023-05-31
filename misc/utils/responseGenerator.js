const {
  OK,
  CREATED,
} = require('../const/http');

const responseGenerator = (res, status, message, data = {}) => res.status(status).json({
  success: status === OK.status || status === CREATED.status,
  message,
  ...data,
});

module.exports = {
  responseGenerator,
};

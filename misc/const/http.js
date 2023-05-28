const OK = { status: 200, message: 'OK' };
const CREATED = { status: 201, message: 'Created' };
const NO_CONTENT = { status: 204, message: 'No Content' };

const MOVED_PERMANENTLY = { status: 301, message: 'Moved Permanently' };

const BAD_REQUEST = { status: 400, message: 'Bad Request' };
const UNAUTHORIZED = { status: 401, message: 'Unauthorized' };
const FORBIDDEN = { status: 403, message: 'Forbidden' };
const NOT_FOUND = { status: 404, message: 'Not Found' };
const METHOD_NOT_ALLOWED = { status: 405, message: 'Method not Allowed' };
const CONFLICT = { status: 409, message: 'Conflict' };

const INTERNAL_SERVER_ERROR = { status: 500, message: 'Internal Server Error' };

module.exports = {
  OK,
  CREATED,
  NO_CONTENT,
  MOVED_PERMANENTLY,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  METHOD_NOT_ALLOWED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
};

const {
  INTERNAL_SERVER_ERROR, OK, NOT_FOUND, CONFLICT, CREATED, BAD_REQUEST,
} = require('../../misc/const/http');

const { sign } = require('../../misc/utils/jwt');
const { generateHash, compareHash } = require('../../misc/utils/bcrypt');

const { responseGenerator } = require('../../misc/utils/responseGenerator');

const {
  findUserById, editUser, findUserByEmail, createNewUser,
} = require('./user.services');

const CONTROLLER = 'src/controllers/user/user.ctrl.js';
const FUNC_GET_USER_BY_ID = 'getUserById()';
const FUNC_EDIT_USER = 'editUser()';
const POST_REGISTER = 'postRegister()';
const POST_LOGIN = 'postLogin()';

const postRegister = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    email,
    name,
    lastname,
    password,
  } = req.body;

  // Verify if user already exists
  let existingUser = null;
  try {
    existingUser = await findUserByEmail(app, { email: email.toLowerCase() });
    if (existingUser) {
      logger.warn(`${CONTROLLER}::${POST_REGISTER}: User already exists`, { ...req.body });
      responseGenerator(res, CONFLICT.status, 'Ese mail ya está registrado.', { errorMessage: 'User already exists' });
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${POST_REGISTER}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor.', { errorMessage: err.message });
    return;
  }

  // // Hash password
  const passwordHash = await generateHash(password);

  // Generate token
  // const token = jwt.sign({
  //   exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  //   email,
  // }, process.env.SECRET_TOKEN_KEY);

  // Create new user
  let user = null;
  try {
    user = await createNewUser(app, {
      email: email.toLowerCase(),
      password: passwordHash,
      name,
      lastname,
      userTokenVerification: null,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${POST_REGISTER}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor.', { errorMessage: err.message });
    return;
  }

  try {
    // Send email
  } catch (err) {
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor.', { errorMessage: 'Error sending email' });
    return;
  }
  responseGenerator(res, CREATED.status, 'Usuario registrado exitosamente!', { user });
};

const postLogin = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    email,
    password,
  } = req.body;

  let token;
  const data = {};

  // Find user
  let user = null;
  try {
    user = await findUserByEmail(app, { email: email.toLowerCase() });
    if (!user) {
      logger.warn(`${CONTROLLER}::${POST_LOGIN}: User does not exist`, { ...req.body });
      responseGenerator(res, BAD_REQUEST.status, 'Credenciales incorrectas.', { errorMessage: 'Wrong credentials' });
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${POST_LOGIN}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor', { errorMessage: err.message });
    return;
  }

  // Verificar que este activo para que pueda hacer le login
  if (!user.active) {
    logger.warn(`${CONTROLLER}::${POST_LOGIN}: User is not validated `, { ...req.body });
    responseGenerator(res, BAD_REQUEST.status, 'Error del servidor', { errorMessage: 'Wrong credentials' });
    return;
  }
  // Compare passwords
  const match = await compareHash(password, user.password);
  if (!match) {
    logger.warn(`${CONTROLLER}::${POST_LOGIN}: Password incorrect`, { ...req.body });
    responseGenerator(BAD_REQUEST.status, 'Credenciales incorrectas.', { errorMessage: 'Wrong credentials' });
    return;
  }
  // User exists and passwords match
  try {
    token = await sign(user);
    data.accessToken = token;
    data.user = user;

    responseGenerator(res, OK.status, 'Inicio de sesión exitoso', data);
  } catch (err) {
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor', { errorMessage: 'Access token could not be generated.' });
  }
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
      logger.warn(`${CONTROLLER}::${FUNC_GET_USER_BY_ID}: User does not exist`, { ...req.body });
      responseGenerator(res, NOT_FOUND.status, 'El usuario que buscas no existe.', { errorMessage: 'User does not exist or has been deleted' });
      return;
    }
    responseGenerator(res, OK.status, 'Usuario encontrado exitosamente', { user });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_GET_USER_BY_ID}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor', { errorMessage: err.message });
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
    logger.error(`${CONTROLLER}::${FUNC_EDIT_USER}: ${err.message}`, { ...req.body });
    responseGenerator(res, INTERNAL_SERVER_ERROR.status, 'Error del servidor', { errorMessage: err.message });
    return;
  }
  responseGenerator(res, OK.status, 'Usuario modificado exitosamente', { user });
};

module.exports = {
  getUserById,
  putUser,
  postRegister,
  postLogin,
};

const jwt = require('jsonwebtoken');
const { sign } = require('../../misc/utils/jwt');
const {
  INTERNAL_SERVER_ERROR, OK, BAD_REQUEST, CONFLICT, CREATED, UNAUTHORIZED,
} = require('../../misc/const/http');

const {
  responseGenerator,
} = require('../../misc/utils/http');

const {
  generateHash,
  compareHash,
} = require('../../misc/utils/bcrypt');

const {
  findUser,
  createNewUser,
  findUserToken,
  findUserByVerificationToken,
} = require('./auth.services');

const CONTROLLER = 'src/controllers/auth/auth.ctrl.js';
const FUNC_POST_REGISTER = 'postRegister()';
const FUNC_POST_LOGIN = 'postLogin()';
const FUNC_RECOVER_PASSWORD = 'recoverPassword()';
const FUNC_RESET_PASSWORD = 'resetPassword()';
const FUNC_USER_VERIFICATION = 'userVerification()';

// USER VERIFICATION
const userVerification = (app) => async (req, res) => {
  const { logger } = app.locals;

  const { password, token } = req.body;

  try {
    // Verify parameters
    if (!token) {
      logger.warn(`${CONTROLLER}::${FUNC_USER_VERIFICATION}: Missing parameter: token`, {
        ...req.body,
      });
      res.status(BAD_REQUEST.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Token is required' }));
      return;
    }

    try {
      // Verify token
      const verified = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

      const now = Date.now();
      if (verified.exp < now) {
        logger.warn(`${CONTROLLER}::${FUNC_USER_VERIFICATION}: Expired token`, {
          ...req.body,
        });
        res.status(OK.status).json(
          responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Expired link' }),
        );
        return;
      }
    } catch (err) {
      logger.warn(`${CONTROLLER}::${FUNC_USER_VERIFICATION}: Invalid token`, {
        ...req.body,
      });
      res.status(UNAUTHORIZED.status).json(
        responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Forbidden' }),
      );
      return;
    }

    // Find user to update
    const user = await findUserByVerificationToken(app, { token });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_USER_VERIFICATION}: Token already used or not valid`);
      res.status(OK.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Link already used or not valid' }));
      return;
    }

    // Hash password
    const hashedPassword = await generateHash(password);

    // Update user
    user.userTokenVerification = null;
    user.password = hashedPassword;
    user.active = true;

    await user.save();

    logger.info(`${CONTROLLER}::${FUNC_USER_VERIFICATION}: User verified successfully.`);
    res.status(OK.status)
      .json(responseGenerator(OK.status, {}));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_USER_VERIFICATION}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
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
    user = await findUser(app, { email: email.toLowerCase() });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_POST_LOGIN}: User does not exist`, {
        ...req.body,
      });
      res.status(BAD_REQUEST.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Wrong credentials' }));
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_LOGIN}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }

  // Verificar que este activo para que pueda hacer le login
  if (!user.active) {
    logger.warn(`${CONTROLLER}::${FUNC_POST_LOGIN}: User is not validated `, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Wrong credentials' }));
    return;
  }
  // Compare passwords
  const match = await compareHash(password, user.password);
  if (!match) {
    logger.warn(`${CONTROLLER}::${FUNC_POST_LOGIN}: Password incorrect`, {
      ...req.body,
    });
    res.status(BAD_REQUEST.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Wrong credentials' }));
    return;
  }
  // User exists and passwords match
  try {
    token = await sign(user);
    data.accessToken = token;
    data.user = user;

    res.status(OK.status)
      .json(responseGenerator(OK.status, data));
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: 'Access token could not be generated.' }));
  }
};

// GENERATE RESET PASSWORD TOKEN
const recoverPassword = (app) => async (req, res) => {
  const { logger } = app.locals;

  const email = req.body.email || null;

  // Verify parameters
  if (!email) {
    logger.warn(`${CONTROLLER}::${FUNC_RECOVER_PASSWORD}: Missing parameter: email`, {
      ...req.body,
    });
    res.status(OK.status)
      .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Email is required' }));
    return;
  }

  try {
    // Find user with email
    const user = await findUser(app, { email: email.toLowerCase() });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_RECOVER_PASSWORD}: email not found`);
      res.status(OK.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Unregistered user' }));
      return;
    }

    // Create reset password token
    const token = jwt.sign({
      exp: Date.now() + 60 * 60 * 1000,
      email,
    }, process.env.SECRET_TOKEN_KEY);

    // Save reset password token
    user.resetPasswordToken = token;

    await user.save();

    // Send email

    res.status(OK.status)
      .json(responseGenerator(OK.status, {}));
    return;
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_RECOVER_PASSWORD}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: 'Server error' }));
  }
};

// UPDATE PASSWORD
const resetPassword = (app) => async (req, res) => {
  const { logger } = app.locals;

  const token = req.body.token || null;
  const password = req.body.password || null;
  const confirmPassword = req.body.confirmPassword || null;

  try {
    // Verify parameters
    if (!token) {
      logger.warn(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Missing parameter: token`, {
        ...req.body,
      });
      res.status(BAD_REQUEST.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Token is required' }));
      return;
    }

    if (!password || !confirmPassword) {
      logger.warn(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Missing parameters: password and confirmPassword`, {
        ...req.body,
      });
      res.status(BAD_REQUEST.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Password and confirmPassword are required' }));
      return;
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      logger.warn(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Parameters do not comply with format: password and/or confirmPassword`, {
        ...req.body,
      });
      res.status(BAD_REQUEST.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Minimum password length is 8 characters' }));
      return;
    }

    if (password !== confirmPassword) {
      logger.warn(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Parameters do not match: password and confirmPassword`, {
        ...req.body,
      });
      res.status(BAD_REQUEST.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Passwords do not match' }));
      return;
    }

    try {
      // Verify token
      const verified = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

      const now = Date.now();
      if (verified.exp < now) {
        logger.warn(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Expired token`, {
          ...req.body,
        });
        res.status(OK.status).json(
          responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Expired link' }),
        );
        return;
      }
    } catch (err) {
      logger.warn(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Invalid token`, {
        ...req.body,
      });
      res.status(UNAUTHORIZED.status).json(
        responseGenerator(UNAUTHORIZED.status, { errorMessage: 'Forbidden' }),
      );
      return;
    }

    // Find user to update
    const user = await findUserToken(app, { token });
    if (!user) {
      logger.warn(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Token already used or not valid`);
      res.status(OK.status)
        .json(responseGenerator(BAD_REQUEST.status, { errorMessage: 'Link already used or not valid' }));
      return;
    }

    const hashedPassword = await generateHash(password);

    // Update password
    user.resetPasswordToken = null;
    user.password = hashedPassword;

    await user.save();

    logger.info(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: Password updated`);
    res.status(OK.status)
      .json(responseGenerator(OK.status, {}));
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_RESET_PASSWORD}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
  }
};

const postRegister = (app) => async (req, res) => {
  const { logger } = app.locals;

  // Get data
  const {
    email,
    name,
    lastname,
    roleId,
    phone,
    country,
  } = req.body;

  // Verify if user already exists
  let existingUser = null;
  try {
    existingUser = await findUser(app, { email: email.toLowerCase() });
    if (existingUser) {
      logger.warn(`${CONTROLLER}::${FUNC_POST_REGISTER}: User already exists`, {
        ...req.body,
      });
      res.status(CONFLICT.status)
        .json(responseGenerator(CONFLICT.status, { errorMessage: 'User already exists' }));
      return;
    }
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_REGISTER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }

  // // Hash password
  const passwordHash = await generateHash('1234');

  // Generate token
  const token = jwt.sign({
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    email,
  }, process.env.SECRET_TOKEN_KEY);

  // Create new user
  let user = null;
  try {
    user = await createNewUser(app, {
      email: email.toLowerCase(),
      password: passwordHash,
      name,
      lastname,
      roleId,
      userTokenVerification: token,
      phone,
      country,
    });
  } catch (err) {
    logger.error(`${CONTROLLER}::${FUNC_POST_REGISTER}: ${err.message}`, {
      ...req.body,
    });
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: err.message }));
    return;
  }

  try {
    // Send email
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR.status)
      .json(responseGenerator(INTERNAL_SERVER_ERROR.status, { errorMessage: 'Error sending email' }));
    return;
  }

  res.status(CREATED.status)
    .json(responseGenerator(CREATED.status, { user }));
};

module.exports = {
  postRegister,
  postLogin,
  recoverPassword,
  resetPassword,
  userVerification,
};

const jwt = require('jsonwebtoken');

const sign = (user) => new Promise((resolve, reject) => {
  const secret = process.env.SECRET_TOKEN_KEY || '';

  if (secret === '') {
    reject(new Error('missing secret must have a value'));
    return;
  }

  let token;
  try {
    const data = {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // Expire in 1 year
      user: {
        id: `${user.id}`,
        role: user.role,
        company: user.company,
      },
    };

    token = jwt.sign(data, secret);
  } catch (err) {
    reject(new Error(`failed to generate token: ${err}`));
    return;
  }
  resolve(token);
});

const createToken = () => {
  const secret = process.env.SECRET_TOKEN_KEY || '';
  if (secret === '') {
    return;
  }
  let token;
  try {
    const data = {
      exp: Math.floor(Date.now() / 100) + 60 * 60 * 1600000000000000,
      // Descomentar para obtener X_USER_TOKEN
      // ejemplo
      // user: {
      //   id: 16,
      //   role: {
      //     name: 'developer',
      //     id: 0,
      //   },
      //   company: 'Tubesoft',
      // },
    };
    token = jwt.sign(data, secret);
  } catch (err) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log('API TOKEN FOR FRONTEND: ', token);
};
if (process.env.NODE_ENV === 'development' && process.env.PRINT_TOKEN === 'true') {
  createToken();
}

const verify = async (token) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const secret = process.env.SECRET_TOKEN_KEY || '';
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(new Error(`failed to verify token: ${err}`));
          return;
        }
        resolve(decoded);
      });
    });
    return {
      success: true,
      result,
    };
  } catch {
    return {
      success: false,
    };
  }
};

module.exports = {
  sign,
  verify,
};

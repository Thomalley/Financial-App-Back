const bcrypt = require('bcrypt');

const generateHash = async (password) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

const compareHash = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

module.exports = {
  generateHash,
  compareHash,
};

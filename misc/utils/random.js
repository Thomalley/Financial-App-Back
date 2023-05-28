const randomString = (length) => {
  let string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    string += characters.charAt(Math.random() * charactersLength);
  }

  return string;
};

module.exports = {
  randomString,
};

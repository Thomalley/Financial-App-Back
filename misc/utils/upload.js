const multer = require('multer');

const upload = multer({
  onError: (err, next) => {
    next(err);
  },
});

module.exports = {
  upload,
};

const messages = require('../utils/message');

const authorize = (roles) => (req, res, next) => {
  return new Promise((resolve, reject) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      reject({ status: 403, message: messages.error.FORBIDDEN }); 
    } else {
      resolve();
    }
  })
  .then(() => {
    next();
  })
  .catch((error) => {
    return res.status(error.status || 403).json({ message: error.message });
  });
};

module.export = {authorize}

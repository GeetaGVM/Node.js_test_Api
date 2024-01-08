const message = require('../utils/message');

function authorize(roles) {
    return function (req, res, next) {
      const { role } = req.user;
      if (!roles.includes(role)) {
        return res.status(403).json({ message: message.error.FORBIDDEN });
      }
      next();
    }
  }
  
  module.exports = authorize;
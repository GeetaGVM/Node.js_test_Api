const commonFunctions = require('../utils/commonFuction');
const User = require('../dbconfig/User');
const messages = require('../utils/message');

async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: messages.error.AUTH_TOKEN_NOT_FOUND });
    }

    const user = await User.findOne({ where: { AccessToken: token } });
    if (!user) {
      return res.status(401).json({ message: messages.error.AUTH_FAILED });
    }

    let role;
    if (user.Role === commonFunctions.UserRole.ADMIN) {
      role = 'admin';
    } else if (user.Role === commonFunctions.UserRole.USER) {
      role = 'user';
    }

    req.user = { ...user.dataValues, role };

    next();
  } catch (error) {
    return res.status(401).json({ message: messages.error.AUTH_FAILED });
  }
}

module.exports = authenticate;
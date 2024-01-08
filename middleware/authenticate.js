const commonFunctions = require('../utils/commonFuction');
const User = require('../dbconfig/user');
const messages = require('../utils/message');
const { verifyToken } = require('../middleware/auth'); 


const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: messages.error.AUTH_TOKEN_NOT_FOUND });
    }

    const decodedUser = await verifyToken(token); // Verify the token

    const user = await User.findOne({ where: { AccessToken: token } });
    if (!user) {
      return res.status(401).json({ message: messages.error.AUTH_FAILED });
    }

    const role = user.Role === commonFunctions.UserRole.ADMIN ? 'admin' : user.Role === commonFunctions.UserRole.USER ? 'user' : null;

    if (!role) {
      return res.status(401).json({ message: messages.error.AUTH_FAILED });
    }

    req.user = { ...decodedUser, role }; // Use the decoded user info here

    next();
  } catch (error) {
    console.error("Authentication error:", error); // Logging the error for debugging
    return res.status(401).json({ message: messages.error.AUTH_FAILED });
  }
};

module.export = {authenticate} 

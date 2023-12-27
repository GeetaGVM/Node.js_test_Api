
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(user, process.env.jwt_secret_key, { expiresIn: '1d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.jwt_secret_key);
};

module.exports = { generateToken, verifyToken };
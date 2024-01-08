const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(user, process.env.jwt_secret_key, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.jwt_secret_key, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = { generateToken, verifyToken };

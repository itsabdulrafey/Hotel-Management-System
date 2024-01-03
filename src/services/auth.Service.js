const jwt = require('jsonwebtoken');
exports.generateAccessToken=(user)=> {
    return jwt.sign(user, process.env.SECRETKEY, { expiresIn: '30m' });
  }
  // Generate Refresh Token
exports.generateRefreshToken=(user)=> {
    return jwt.sign(user, process.env.SECRETKEY);
}
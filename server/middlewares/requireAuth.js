const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../../config/config')


const requireAuth = function (req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: '认证码失效，请重新登录!'
          });
        } else {
          return res.status(401).json({
            error: '认证失败！'
          });
        }
      } else {
        if (decoded.admin === true) {
          next();
        } else {
          res.status(401).json({
            error: '认证失败！'
          });
        }
      }
    });
  } else {
    return res.status(403).json({
      error: '请提供认证码！'
    });
  }
}

module.exports = requireAuth;
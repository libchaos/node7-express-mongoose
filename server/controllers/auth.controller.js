const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../models/user.model');


const generateToken = function (user) {
  return jwt.sign(user, config.jwtSecret, {
    expiresIn: 3600,
  })
}


async function login(req, res, next) {
  const user = await User.findOne({
    username: req.body.username
  });
  if (user) {
    const token = generateToken({
      admin: true
    })
    return res.json({
      token,
      username: user.username
    })
  }
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}

async function register(req, res, next) {
  try {
    const user = await new User({
      username: req.body.username,
      mobileNumber: 12345678901
    });
    user.save();
    if (user) {
      const token = generateToken({
        admin: true
      })
      return res.json({
        token,
        username: user.username
      });
    }
  } catch (err) {
    next(err)
  }
}

function getRandomNumber(req, res) {
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = {
  login,
  getRandomNumber,
  register
}
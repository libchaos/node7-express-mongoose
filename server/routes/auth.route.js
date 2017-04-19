const express = require('express');
const validate = require('express-validation');
const expressJWT = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('../controllers/auth.controller');
const config = require('../../config/config')
const wrapRouter = require('express-router-async-support').wrapRouter


const router = wrapRouter(express.Router());

router.route('/login')
  .post(validate(paramValidation), authCtrl.login);

router.route('/register')
  .post(validate(paramValidation), authCtrl.register);

router.route('/random-number')
  .get(expressJWT({ secret: config.jwtSecret }), authCtrl.getRandomNumber);



module.exports = router;
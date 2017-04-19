const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('../controllers/user.controller');
const wrapRouter = require('express-router-async-support').wrapRouter;
const requireAuth = require('../middlewares/requireAuth');

const router = wrapRouter(express.Router());

router.route('/')
  .get(requireAuth, userCtrl.list)
  .post(validate(paramValidation.createUser), userCtrl.create)


router.route('/:userId')
  .get(userCtrl.get)
  .put(validate(paramValidation.updateUser), userCtrl.update)
  .delete(userCtrl.remove);

router.param('userId', userCtrl.load);

module.exports = router;
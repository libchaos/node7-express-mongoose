const express = require('express');
const wrapRouter = require('express-router-async-support').wrapRouter;
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const router = wrapRouter(express.Router());




router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
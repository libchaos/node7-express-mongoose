const User = require('../models/user.model')

async function load(req, res, next, id) {
  try {
    const user = await User.get(id);
    req.user = user;
    next()
  } catch(err) {
    next(err);
  }
}


async function get(req, res) {
  return res.json(req.user);
}

async function create(req, res, next) {
  try {
    const user = await new User({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber,
    }).save();
    res.json(user);
  } catch(err) {
    next(err);
  }
}

async function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  const user_saveed = await user.save();
  res.json(user_saveed);
}

async function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  const users = await User.list({ limit, skip });
  res.json(users);
}

async function remove(req, res, next) {
  try {
    const deleteUser = await user.remove();
    res.json(deleteUser);
  } catch(err) {
    next(err);
  }
}

module.exports = {
  load,
  get,
  create,
  list,
  remove,
  update,
}
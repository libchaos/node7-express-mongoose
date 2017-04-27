const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const Promise = global.Promise;
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{10}$/, 'The value of path {PATH} {VALUE} is not a valid number']
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});



UserSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
  },
  list({
    skip = 0,
    limit = 50
  } = {}) {
    return this.find()
      .sort({
        createAt: -1
      })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
}


module.exports = mongoose.model('User', UserSchema);
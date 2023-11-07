const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const users = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "email is invalid",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

users.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne( email )
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("users", users);

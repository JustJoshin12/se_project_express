const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../models/user");
const {
  invalidData,
  notFound,
  serverError,
  duplicateData,
  unauthorize,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res.status(invalidData).send({ message: "Please include an email" });
  }

  return users
    .findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(duplicateData)
          .send({ message: "A user with that email already exists." });
      }

      bcrypt.hash(password, 10).then((hash) => {
        users
          .create({ name, avatar, email, password: hash })
          .then((data) => {
            return res.send({
              name: data.name,
              avatar: data.avatar,
              email: data.email,
             });
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              return res
                .status(invalidData)
                .send({ message: "Invalid data entry" });
            }
            if (err.code === 11000) {
              res
                .status(duplicateData)
                .send({ message: "Email already exist" });
            }
            return res
              .status(serverError)
              .send({ message: "Error from createUser" });
          });
      });
    })
    .catch(() => {
      res.status(serverError).send({ message: "Error from createUser" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return users
    .findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("incorrect username or password"));
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      res.status(unauthorize).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  users
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid data entry" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Info not found" });
      }
      return res.status(serverError).send({ message: "Error from getUser" });
    });
};

const updateProfile = (req, res) => {
  users
    .findOneAndUpdate({ _id: req.user._id }, { name: req.body.name, avatar: req.body.avatar }, {
      new: true,
      runValidators: true,
    })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid data entry" });
      }
      if(err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Info not found"});
      }
      return res.status(serverError).send({ message: "Error from getUser" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};

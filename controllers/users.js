const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
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

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(duplicateData).send({message: "User information already exist."});
    }

    bcrypt.hash(password, 10).then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          res.send({ data: user });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            return res
              .status(invalidData)
              .send({ message: "Invalid data entry" });
          }
          if (err.name === "CastError") {
            return res.status(invalidData).send({ message: "Invalid ID" });
          }
          return res
            .status(serverError)
            .send({ message: "Error from createUser" });
        });
    });
  });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(serverError).send({ message: "Error from getUsers" });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("incorrect username or password"));
      }

      const token = jwt.sign({ _id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      res.status(unauthorize).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
};

const updateProfile = (req, res) => {
  User.findOneAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => {
      res.status(OK).send({ user });
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};

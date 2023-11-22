const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorize-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return next(new BadRequestError("Please include an email"));
  }

  return users
    .findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError("A user with this email already exists."))
      }

      return bcrypt.hash(password, 10)
      .then((hash) => {
        users
          .create({ name, avatar, email, password: hash })
          .then((data) => res.send({
            name: data.name,
            avatar: data.avatar,
            email: data.email,
          }))
          .catch((err) => {
            if (err.name === "ValidationError") {
              return next(new BadRequestError("Invalid data entry"))
            }
            if (err.code === 11000) {
              return next(new ConflictError("Email already exist"))
            }
           next(err)
          });
      });
    })
    .catch((err) => {
      next(err)
    })
};

const login = (req, res, next) => {
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
      console.error(err);
      return next(new UnauthorizedError("Unauthorize"));
    });
};

const getCurrentUser = (req, res, next) => {
  users
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data entry"))
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Info not found"));
      }
      next(err)
    });
};

const updateProfile = (req, res, next) => {
  const {name, avatar} = req.body;
  const userId = req.user._id;
  users
    .findByIdAndUpdate(
      userId, {name, avatar},
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data entry"))
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Info not found"))
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};

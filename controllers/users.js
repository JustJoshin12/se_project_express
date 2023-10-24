const User = require("../models/user");
const { invalidData, notFound, serverError } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if ( err.name === "ValidationError") {
        return res.status(invalidData).send({ message: "Invalid data entry" })
      }
      return res.status(serverError).send({ message: "Error from createUser" });
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
        return res.status(invalidData).send({message: "Invalid data entry"})
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Info not found"})
      }
     return res.status(serverError).send({ message: "Error from getUser"});
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};

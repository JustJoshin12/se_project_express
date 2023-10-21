const User = require('../models/user');

const createUser = (req,res) => {
  const {name, avatar} = req.body;
  User.create({name, avatar})
  .then((user) => {
    res.send({ data: user });
  })
  .catch((e) => {
    res.status(500).send({message: "Error from createUser", e});
  });
};

const getUsers = (req,res) => {
  User.find({})
  .then((user) => res.send({ data: user}))
  .catch((e) => {res.status(500).send({message: "Error from getUsers", e})});
};

const getUser = (req,res) => {
 User.findById(req.params.userId)
 .orFail()
 .then((user) => res.status(200).send({ data: user }))
 .catch((e) => {
  res.status(500).send({ message: "Error from getUser", e });
 });
}


module.exports = {
  createUser,
  getUsers,
  getUser
};
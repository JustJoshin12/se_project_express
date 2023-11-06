const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./users");
const { notFound } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { authorize } = require("../middleware/auth");

router.use("/items", clothingItem);
router.use("/users",  users);

router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(notFound).send({
    message: "Requested resource not found",
  });
});

module.exports = router;

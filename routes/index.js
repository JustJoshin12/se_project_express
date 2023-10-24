const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./users");
const { notFound } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  res.status(notFound).send({
    message: "Requested resource not found",
  });
});

module.exports = router;

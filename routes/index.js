const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./users");
const NotFoundError = require("../errors/not-found-error");
const { login, createUser } = require("../controllers/users");
const { authorize } = require("../middleware/auth");
const { validateLoginAuthentication, validateUserInfoBody } = require("../middleware/validation");

router.use("/items", clothingItem);
router.use("/users", authorize, users);

router.post("/signin", validateLoginAuthentication, login);
router.post("/signup", validateUserInfoBody, createUser);

router.use((req, res, next) => {
   next(new NotFoundError("Requested resource not found"));
});

module.exports = router;

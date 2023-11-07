const router = require("express").Router();
const { authorize } = require("../middleware/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", authorize, getCurrentUser);
router.patch("/me", authorize, updateProfile);

module.exports = router;

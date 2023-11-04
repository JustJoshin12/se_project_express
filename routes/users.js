const router = require("express").Router();
const { authorize } = require("../middleware/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("users/me", authorize, getCurrentUser);
router.patch("users/me", authorize, updateProfile);

module.exports = router;

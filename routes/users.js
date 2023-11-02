const router = require("express").Router();

const {  getUser, getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/:userId", getUser);
router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);

module.exports = router;

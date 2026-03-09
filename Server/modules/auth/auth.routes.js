const router = require("express").Router();
const authController = require("./auth.controller");
const auth = require("../../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/update-profile", auth, authController.updateUserProfile);

module.exports = router;
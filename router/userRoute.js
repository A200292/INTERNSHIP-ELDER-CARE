const express = require("express");
const router = express.Router();
const userContoller = require("../controller/userController");

router.post("/signup", userContoller.signup);
router.post("/login", userContoller.login);


module.exports = router;
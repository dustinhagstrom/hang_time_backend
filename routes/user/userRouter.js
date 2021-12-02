const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  signupUser,
  loginUser,
  deleteUser,
  editUserInfo,
} = require("./controller/userController");

router.post("/new", signupUser);
router.post("/loginUser", loginUser);
router.delete("/deleteUser", deleteUser);
router.put("/editUserInfo", editUserInfo);

module.exports = router;

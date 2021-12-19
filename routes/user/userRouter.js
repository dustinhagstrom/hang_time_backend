const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  signupUser,
  loginUser,
  deleteUser,
  editUserInfo,
} = require("./controller/userController");
const checkIsEmptyFunc = require("./helpers/checkIsEmptyFunc");
const checkIsUndefined = require("./helpers/checkIsUndefined");
const checkIsStrongPasswordFunc = require("./helpers/checkIsStrongPasswordFunc");
const {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
} = require("./helpers/authMiddleware");

router.post(
  "/new",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsStrongPasswordFunc,
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
  signupUser
);

router.post(
  "/loginUser",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsEmailFunc,
  loginUser
);

router.delete("/deleteUser", deleteUser);
router.put("/editUserInfo", editUserInfo);

module.exports = router;

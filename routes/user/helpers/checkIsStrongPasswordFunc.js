const { checkIsStrongPassword } = require("../../utils/authMethods"); //bring in checkisstrongpassword authmethod

function checkIsStrongPasswordFunc(req, res, next) {
  const { errorObj } = res.locals;
  next();
}

module.exports = checkIsStrongPasswordFunc;

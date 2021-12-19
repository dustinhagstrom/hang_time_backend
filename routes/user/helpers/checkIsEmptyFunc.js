const { checkIsEmpty } = require("../../utils/authMethods");

function checkIsEmptyFunc(req, res, next) {
  const { errorObj } = res.locals;

  let userObj = req.body;
  for (let field in userObj) {
    if (checkIsEmpty(userObj[field])) {
      errorObj[field] = `${field} cannot be empty.`;
    }
  }

  if (Object.keys(errorObj).length > 0) {
    return res.status(500).json({ message: "failure", payload: errorObj });
  } else {
    next();
  }
}

module.exports = checkIsEmptyFunc;

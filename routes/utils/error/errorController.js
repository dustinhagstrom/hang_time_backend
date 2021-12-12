const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass");

function dispatchErrorDevelopment(error, req, res) {
  console.log("inside dispatchErrorDevelopment", error);
  if (req.originalUrl.startsWith("/api")) {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack || "wrong user input",
    });
  }
}

function dispatchErrorProduction(error, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
      });
    }
    return res.status(error.statusCode).json({
      status: "Error",
      message:
        "Something went Wrong. Please contact support at 111-222-3333 or email us at dd@dmail.com",
    });
  }
}

function handleMongoDBDuplicate(error) {
  let errorMessageDuplicateKey = Object.keys(error.keyValue)[0];

  let errorMessageDuplicateValue = Object.values(error.keyValue)[0];
  let message = `${errorMessageDuplicateKey} - ${errorMessageDuplicateValue} is taken. Please choose another one.`;
  let newErrorObj = new ErrorMessageHandlerClass(message, 400);
  return newErrorObj;
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //gives mongodb status 500. is statusCode undefined
  err.status = err.status || "error";

  let error = { ...err }; //spread operator does not copy properties of the original error obj gen from js in this case because "err" obj is a node/mongo err obj.
  error.message = err.message;
  console.log("errorController: ", error);
  console.log(Object.keys(error));

  if (error.code === 11000 || error.code === 11001) {
    error = handleMongoDBDuplicate(error);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("inside process.env.NODE_ENV: ");
    dispatchErrorDevelopment(error, req, res);
  } else {
    dispatchErrorProduction(error, req, res);
  }
};

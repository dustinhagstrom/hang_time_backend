const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const logger = require("morgan");

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass");
const errorController = require("./routes/utils/errorController");
const usersRouter = require("./routes/user/userRouter");
const strikesRouter = require("./routes/strikes/strikesRouter");
const wordRouter = require("./routes/word/wordRouter");
const userPassportStrategy = require("./routes/utils/passport/UserPassport");

const app = express();

//middleware
app.use(cookieParser());
app.use(passport.initialize());
passport.use("jwt-user", userPassportStrategy);

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let originalUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "DEPLOY URL";
app.use(cors({ origin: originalUrl, credentials: true }));

//routes
app.use("/api/users", usersRouter);
app.use("/api/strikes", strikesRouter);
app.use("/api/word", wordRouter);

// below runs only if there is an error with the request and res cannot close
app.all("*", function (req, res, next) {
  next(
    new ErrorMessageHandlerClass(
      `Cannot find ${req.originalUrl} on this server! Check your URL`,
      404
    )
  );
});
app.use(errorController);
module.exports = app;

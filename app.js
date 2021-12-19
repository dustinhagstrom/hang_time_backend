const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const logger = require("morgan");
const rateLimit = require("express-rate-limit");

const ErrorMessageHandlerClass = require("./routes/utils/error/ErrorMessageHandlerClass");
const errorController = require("./routes/utils/error/errorController");
const usersRouter = require("./routes/user/userRouter");
const strikesRouter = require("./routes/strikes/strikesRouter");
const wordRouter = require("./routes/word/wordRouter");
const userPassportStrategy = require("./routes/utils/UserPassport");
//limiter function. can change first num at adjust time and can change value of second key to adjust number of attempts.
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error:
      "Too many requests from this IP, please try again or contact support",
  },
});

const app = express();

//middleware
app.use("/api", limiter); //use limiter
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
app.use(errorController);
app.all("*", function (req, res, next) {
  next(
    new ErrorMessageHandlerClass(
      `Cannot find ${req.originalUrl} on this server! Check your URL`,
      404
    )
  );
});
module.exports = app;

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
let originalUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "DEPLOY URL";

//middleware
app.use(passport.initialize());
passport.use("jwt-player", playerPassportStrategy);

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({ origin: originalUrl, credentials: true }));

//routes
app.use("/api/users", usersRouter);

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

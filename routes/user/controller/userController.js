const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const signupUser = async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;
  let emailLC = email.toLowerCase();

  try {
    let salt = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(password, salt);

    const welcomeUser = new User({
      firstName,
      lastName,
      username,
      email: emailLC,
      password: hashedPassword,
    });

    await welcomeUser.save();
    res.json({ message: "user created successfully, please login." });
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  let emailLC = email.toLowerCase();

  try {
    let foundUser = await User.findOne({ email: emailLC });

    if (!foundUser) {
      throw new Error("Incorrect email or password.");
    } else {
      let comparedPassword = await bcrypt.compare(password, foundUser.password);

      if (!comparedPassword) {
        throw new Error("Incorrect email or password.");
      } else {
        let jwtToken = jwt.sign(
          {
            email: foundUser.email,
            username: foundUser.username,
          },
          process.env.PRIVATE_JWT_KEY
        );

        res.cookie("jwt-cookie", jwtToken, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: false, //flags cookie to be accessible only by web server
          secure: false, //marks cookie to be used with https only
        });

        res.json({
          message: "Login Successful",
          user: {
            email: foundUser.email,
            username: foundUser.username,
          },
        });
      }
    }
  } catch (e) {
    next(e);
  }
};
const deleteUser = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};
const editUserInfo = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signupUser,
  loginUser,
  deleteUser,
  editUserInfo,
};

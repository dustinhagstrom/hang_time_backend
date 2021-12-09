const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../../user/model/User");

const keys = process.env.PRIVATE_JWT_KEY;

//the setup that follows is from passport-jwt documentation for example req with auth headers
const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = keys; //can be buffer or string

//jwt auth strategy constructed by:
// new JwtStrategy(options, verify);
const userJWTLoginStrategy = new JwtStrategy(
  jwtOptions,
  async (payload, done) => {
    const userEmail = payload.email;

    try {
      if (userEmail) {
        const user = await User.findOne({ email: userEmail }).select(
          "-password"
        );

        if (!user) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e, false);
    }
  }
);

module.exports = userJWTLoginStrategy;

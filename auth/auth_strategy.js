const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const JWT_SECRET = process.env.JWT_SECRET;
const APP_NAME = process.env.APP_NAME;

// Passport middleware to handle user registration
passport.use('signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        console.log("Use signup");

        try {
          const user = await UserModel.create({ email, password });
          return done(null, user);
        } catch (error) {
            console.log(error);
          done(error);
        }
      }
    )
);

  //  Passport middleware to handle user login
passport.use('login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            console.log("Use login");

            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);
                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

// useful for testing
var cookieExtractor = function(req) {

    console.log(req);

    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};
//opts.jwtFromRequest = cookieExtractor;

passport.use(
  new JWTstrategy(  
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      issuer: APP_NAME,
    },
    async (token, done) => {
      try {
        console.log("Auth successful");
        return done(null, token.user);
      } catch (error) {
        console.log(error);

        done(error);
      }
    }
  )
);
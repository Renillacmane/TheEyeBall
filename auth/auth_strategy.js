const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/model');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

/**
 * TODO - Move to `.env` file.
 */
const JWT_SECRET = 'TOP_SECRET';
const APP_NAME = 'Awesome APP';

// Passport middleware to handle user registration
passport.use(
    'signup',
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
          done(error);
        }
      }
    )
);

  //  Passport middleware to handle user login
passport.use(
    'login',
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

passport.use(
  new JWTstrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
      // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // o luis pos diferente
      issuer: APP_NAME,
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
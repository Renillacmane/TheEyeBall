const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const {
  InvalidCredentialsError,
  TokenVerificationError,
  UserExistsError,
  ValidationError
} = require('../errors/auth-errors');

const JWT_SECRET = process.env.JWT_SECRET;
const APP_NAME = process.env.APP_NAME;
const MIN_PASSWORD_LENGTH = 6;

// Passport middleware to handle user registration
passport.use('signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          // Validate email
          if (!email || !email.includes('@')) {
            throw new ValidationError('Invalid email format');
          }

          // Check if user exists
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            throw new UserExistsError();
          }

          // Validate password
          if (!password || password.length < MIN_PASSWORD_LENGTH) {
            throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
          }

          const user = await UserModel.create({ email, password });
          return done(null, user);
        } catch (error) {
          return done(error);
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
            try {
                // Find user and validate password
                const user = await UserModel.findOne({ email });
                if (!user || !(await user.isValidPassword(password))) {
                    throw new InvalidCredentialsError();
                }

                return done(null, user);
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
        // Verify token structure
        if (!token?.user?._id) {
          throw new TokenVerificationError('Invalid token structure');
        }

        // Verify user still exists
        const user = await UserModel.findById(token.user._id);
        if (!user) {
          throw new TokenVerificationError('User no longer exists');
        }

        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

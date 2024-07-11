const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN; // For debugging
const APP_NAME = process.env.APP_NAME;

const router = express.Router();

const missingFieldError = (res, fieldName) =>
  res.status(400).json({ message: `Field '${fieldName}' is missing.` });

// Signup endpoint for the user
router.post('/signup',
      passport.authenticate('signup',
      { session: false }),
      async (req, res, next) => {
          console.log("Attempt signup");
          res.json({
              message: 'Signup successful',
              user: req.user
          });
      }) 
;

// Login endopoint for the user
// You store the id and email in the payload of the JWT. You then sign the token with a secret or key (TOP_SECRET)
router.post( '/login', (req, res, next) => {
  console.log("Attempt login");

  const { email, password } = req.body;

  // fields validations
  if (!email) {
    return missingFieldError(res, 'email');
  }
  if (!password) {
    return missingFieldError(res, 'password');
  }

  // Attempt authentication
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return next(new Error('An error occurred.'));
      }

      req.login( user, { session: false },
        async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN, issuer: APP_NAME },
            (err, token) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Unknown Error' });
              }

              return res.status(200).json({ data: token });
            });
        });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
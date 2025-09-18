const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const UserModel = require('../models/user');
const { ValidationError, InvalidCredentialsError } = require('../errors/auth-errors');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const APP_NAME = process.env.APP_NAME;

const router = express.Router();

// Signup endpoint for the user
router.post('/signup',
      passport.authenticate('signup',
      { session: false }),
      async (req, res, next) => {
          const { firstName, lastName } = req.body;
          const email = req.user.email;
          
          if (!firstName || !lastName) {
            throw new ValidationError('First name and last name are required');
          }

          const user = await UserModel.findOne({ email });
          user.firstName = firstName;
          user.lastName = lastName;
          await user.save();
          
          res.json({
            message: 'Signup successful',
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
      }) 
;

// Login endopoint for the user
// You store the id and email in the payload of the JWT. You then sign the token with a secret or key (TOP_SECRET)
router.post( '/login', (req, res, next) => {
  const { email, password } = req.body;

  // Field validations
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Attempt authentication
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        throw new InvalidCredentialsError();
      }

      await new Promise((resolve, reject) => {
        req.login(user, { session: false }, (error) => {
          if (error) reject(error);
          resolve();
        });
      });

      const body = { 
        _id: user._id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      try {
        const token = await promisify(jwt.sign)(
          { user: body },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN, issuer: APP_NAME }
        );
        return res.status(200).json({ 
          data: token,
          user: body
        });
      } catch (err) {
        throw new Error('Failed to generate authentication token');
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;

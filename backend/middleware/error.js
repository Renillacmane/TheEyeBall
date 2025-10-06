const {
  AuthenticationError,
  InvalidCredentialsError,
  TokenVerificationError,
  ValidationError,
  UserExistsError
} = require('../errors/auth-errors');

module.exports = function (err, req, res, next) {
  // Log error for debugging
  console.error(err);

  // Default error
  let status = err.status || 500;
  let message = 'Internal Server Error';
  let details = undefined;

  // Development error details
  if (process.env.NODE_ENV !== 'production') {
    details = {
      stack: err.stack,
      name: err.name
    };
  }

  // Handle known errors
  if (err instanceof ValidationError || err instanceof AuthenticationError) {
    message = err.message;
    if (err instanceof UserExistsError) {
      details = { field: 'email' };
    }
  }
  // Handle Mongoose validation errors
  else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
    details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }
  // Handle MongoDB duplicate key errors
  else if (err.code === 11000) {
    status = 400;
    message = 'Duplicate Entry';
    details = {
      field: Object.keys(err.keyPattern)[0]
    };
  }

  res.status(status).json({
    error: {
      message,
      ...(details && { details })
    }
  });
};

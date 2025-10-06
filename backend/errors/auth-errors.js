class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

class InvalidCredentialsError extends AuthenticationError {
  constructor(message = 'Invalid email or password') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

class TokenVerificationError extends AuthenticationError {
  constructor(message = 'Invalid or expired token') {
    super(message);
    this.name = 'TokenVerificationError';
  }
}

class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class UserExistsError extends ValidationError {
  constructor(message = 'User already exists') {
    super(message);
    this.name = 'UserExistsError';
  }
}

module.exports = {
  AuthenticationError,
  InvalidCredentialsError,
  TokenVerificationError,
  ValidationError,
  UserExistsError
};

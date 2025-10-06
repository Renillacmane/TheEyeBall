// MongoDB initialization script for TheEyeBall-BE
// Creates the application database and user

// Switch to the application database
db = db.getSiblingDB('theeyeball');

// Create application user
db.createUser({
  user: 'theeyeball_user',
  pwd: 'theeyeball_password',
  roles: [
    {
      role: 'readWrite',
      db: 'theeyeball'
    }
  ]
});

// Create initial collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'firstName', 'lastName'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email address'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password must be at least 6 characters'
        },
        firstName: {
          bsonType: 'string',
          minLength: 1,
          description: 'First name is required'
        },
        lastName: {
          bsonType: 'string',
          minLength: 1,
          description: 'Last name is required'
        }
      }
    }
  }
});

db.createCollection('movies');
db.createCollection('userreactions');
db.createCollection('communitygenres');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.movies.createIndex({ id_external: 1 }, { unique: true });
db.userreactions.createIndex({ id_user: 1, id_movie: 1 }, { unique: true });
db.communitygenres.createIndex({ genre_id: 1 }, { unique: true });

print('TheEyeBall-BE database initialized successfully!');

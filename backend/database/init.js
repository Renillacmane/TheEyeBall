const mongoose = require('mongoose');

// Database configuration with environment variables
const getDatabaseConfig = () => {
  // Get the URI template and substitute credentials
  let uri = process.env.MONGODB_URI || 
           `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@nodejs.tk4ldce.mongodb.net/${process.env.DB_NAME || 'theeyeball'}?retryWrites=true&w=majority&appName=NodeJS`;
  
  // If URI contains template variables, substitute them
  if (uri.includes('${DB_USER}') && uri.includes('${DB_PWD}')) {
    uri = uri.replace('${DB_USER}', process.env.DB_USER || '');
    uri = uri.replace('${DB_PWD}', process.env.DB_PWD || '');
    uri = uri.replace('${DB_NAME}', process.env.DB_NAME || 'theeyeball');
  }
  
  // Debug logging for database configuration
  if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV === 'development') {
    console.log('🔍 Database Configuration:');
    console.log('  - Database Name:', process.env.DB_NAME);
    console.log('  - Database User:', process.env.DB_USER);
    console.log('  - Connection URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
  }

  const config = {
    uri: uri,
    
    options: {
      // Connection options for production readiness (Mongoose 8.x compatible)
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority'
    }
  };

  // Add SSL configuration for production (Mongoose 8.x compatible)
  if (process.env.NODE_ENV === 'production') {
    config.options.tls = true;
    config.options.tlsAllowInvalidCertificates = false;
  }

  return config;
};

// Enhanced connection function with retry logic
const connectWithRetry = async (config, retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(config.uri, config.options);
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error(`❌ Database connection failed (attempt ${6 - retries}):`, error.message);
    
    if (retries > 0) {
      console.log(`🔄 Retrying connection in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectWithRetry(config, retries - 1, delay * 1.5); // Exponential backoff
    } else {
      console.error('💥 Database connection failed after all retries');
      process.exit(1);
    }
  }
};

// Initialize database connection
const initializeDatabase = async () => {
  try {
    const config = getDatabaseConfig();
    
    // Validate required environment variables
    if (!process.env.MONGODB_URI && (!process.env.DB_USER || !process.env.DB_PWD || !process.env.DB_NAME)) {
      throw new Error('Missing required database environment variables: MONGODB_URI or (DB_USER, DB_PWD, and DB_NAME)');
    }

    await connectWithRetry(config);
    
    // Set up connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('📊 MongoDB connected to:', mongoose.connection.host);
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('💥 Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Export for use in app.js
module.exports = { initializeDatabase };

// Auto-initialize if this file is run directly
if (require.main === module) {
  initializeDatabase();
}



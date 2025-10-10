// Test: What happens when we try to use your current backend in Vercel functions

// This is what would happen if we tried to use your current Express app directly
const express = require('express');
const mongoose = require('mongoose');

// Your current app.js structure
const app = express();

// Your current middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Your current database initialization
const initializeDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 
               `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@nodejs.tk4ldce.mongodb.net/${process.env.DB_NAME || 'theeyeball'}?retryWrites=true&w=majority&appName=NodeJS`;
    
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Your current route structure
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // PROBLEM 1: Database connection on every request
    console.log('🔄 Attempting database connection...');
    await initializeDatabase();
    
    // PROBLEM 2: Express app doesn't work directly in serverless
    // We need to manually handle the request
    if (req.method === 'GET' && req.url === '/health') {
      return res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    }
    
    return res.status(404).json({ error: 'Not found' });
    
  } catch (error) {
    console.error('❌ Function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}


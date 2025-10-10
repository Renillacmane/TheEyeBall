// Example: Simple serverless function that works well
// This shows what serverless functions are good for

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      message: 'This is a simple serverless function - perfect for Vercel!'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// This works great because:
// 1. No database connections
// 2. No complex middleware
// 3. Stateless operation
// 4. Fast execution
// 5. Perfect for health checks, simple APIs, etc.


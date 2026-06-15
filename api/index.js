const app = require('../backend/app.js');
const connectDB = require('../backend/config/database.js');

// Vercel Serverless Function entry point
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      // Even if it fails, let app handle it or return 500
    }
  }

  // Pass the request to the Express app
  return app(req, res);
};

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CareerFlyht API running'
  });
});

// Error Handling Middleware (must be after routes)
app.use(errorHandler);

module.exports = app;

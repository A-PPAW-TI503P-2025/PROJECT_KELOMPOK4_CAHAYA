require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./models");
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const webRoutes = require('./routes/webRoutes');
const userRoutes = require('./routes/userRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "Smart Lighting System API - Server is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      device: "/api/device",
      web: "/api/web",
      users: "/api/users"
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/web', webRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Database sync and server start
db.sequelize.sync()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

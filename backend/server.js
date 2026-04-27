const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require("cors");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Enable CORS
app.use(cors());

// Routes (to be added)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Product Routes
app.use('/api/products', require('./routes/productRoutes'));

// Order Routes
app.use('/api/orders', require('./routes/orderRoutes'));

// Payment Routes
app.use('/api/payment', require('./routes/paymentRoutes'));

// Upload Routes
app.use('/api/upload', require('./routes/uploadRoutes'));

// Coupon Routes
app.use('/api/coupons', require('./routes/couponRoutes'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

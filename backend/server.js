require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Security headers
app.use(helmet());

// Restrict CORS to the allowed frontend origin in production
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(express.json());

// Rate limiter for auth routes — max 20 attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many attempts from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chefRoutes = require('./routes/chefRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global error handler — catches any unhandled errors thrown in routes
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.path} —`, err.message);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

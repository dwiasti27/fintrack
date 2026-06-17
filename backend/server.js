require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const accessLogger = require('./middleware/loggerMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Middleware
// ============================================================
app.use(cors({
    origin: '*', // Allow all origins during development. Restrict in production.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(accessLogger); // 📋 Log setiap request masuk

// ============================================================
// Routes
// ============================================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transaksi', require('./routes/transaksi'));
app.use('/api/kategori', require('./routes/kategori'));
app.use('/api/profil', require('./routes/profil'));
app.use('/api/notifikasi', require('./routes/notifikasi'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/api/status', (req, res) => {
    res.json({ status: 'success', message: '🚀 FINTRACK Backend is running!' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: `Route ${req.originalUrl} tidak ditemukan.` });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    console.log(`📡 API tersedia di http://localhost:${PORT}/api/status`);
});

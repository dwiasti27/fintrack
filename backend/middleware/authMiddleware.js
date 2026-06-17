const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ status: 'error', message: 'Token tidak valid atau sudah kadaluarsa.' });
        }
    }

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Tidak ada token. Akses ditolak.' });
    }
};

module.exports = { protect };

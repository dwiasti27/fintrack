/**
 * FINTRACK Admin Guard Middleware
 * Hanya bisa diakses jika user memiliki role 'admin'.
 * Harus digunakan SETELAH middleware `protect`.
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            status: 'error',
            message: 'Akses ditolak. Hanya Admin yang diizinkan.'
        });
    }
};

module.exports = { adminOnly };

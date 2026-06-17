const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/profil
const getProfil = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nama_lengkap, email, no_hp, kode_negara, avatar, tema_pilihan, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'User tidak ditemukan.' });
        res.json({ status: 'success', data: rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal mengambil profil.' });
    }
};

// @desc    Update user profile
// @route   PUT /api/profil
const updateProfil = async (req, res) => {
    const { nama_lengkap, no_hp, kode_negara, tema_pilihan } = req.body;
    try {
        await db.query(
            'UPDATE users SET nama_lengkap=?, no_hp=?, kode_negara=?, tema_pilihan=? WHERE id=?',
            [nama_lengkap, no_hp, kode_negara, tema_pilihan, req.user.id]
        );
        res.json({ status: 'success', message: 'Profil berhasil diperbarui!' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal memperbarui profil.' });
    }
};

// @desc    Update password
// @route   PUT /api/profil/password
const updatePassword = async (req, res) => {
    const { password_lama, password_baru } = req.body;
    if (!password_lama || !password_baru) {
        return res.status(400).json({ status: 'error', message: 'Password lama dan baru wajib diisi.' });
    }
    if (password_baru.length < 6) {
        return res.status(400).json({ status: 'error', message: 'Password baru minimal 6 karakter.' });
    }
    try {
        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
        const isMatch = await bcrypt.compare(password_lama, users[0].password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Password lama salah.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password_baru, salt);
        await db.query('UPDATE users SET password=? WHERE id=?', [hashed, req.user.id]);
        res.json({ status: 'success', message: 'Password berhasil diubah!' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal mengubah password.' });
    }
};

module.exports = { getProfil, updateProfil, updatePassword };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Helper to generate JWT
const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
    const { nama_lengkap, email, password, no_hp, kode_negara } = req.body;

    // Validation
    if (!nama_lengkap || !email || !password || !no_hp) {
        return res.status(400).json({ status: 'error', message: 'Semua kolom wajib diisi.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ status: 'error', message: 'Password minimal 6 karakter.' });
    }

    try {
        // Check if email already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ status: 'error', message: 'Email sudah terdaftar.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user to DB
        const [result] = await db.query(
            'INSERT INTO users (nama_lengkap, email, password, no_hp, kode_negara) VALUES (?, ?, ?, ?, ?)',
            [nama_lengkap, email, hashedPassword, no_hp, kode_negara || '+62']
        );

        const newUserId = result.insertId;
        const token = generateToken(newUserId, email, 'user');

        res.status(201).json({
            status: 'success',
            message: 'Akun berhasil dibuat!',
            token,
            user: { id: newUserId, nama_lengkap, email, no_hp, role: 'user' }
        });
    } catch (error) {
        console.error('Register Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email dan password wajib diisi.' });
    }

    try {
        // Find user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Email atau password salah.' });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Email atau password salah.' });
        }

        const token = generateToken(user.id, user.email, user.role);

        res.json({
            status: 'success',
            message: 'Login berhasil!',
            token,
            user: { id: user.id, nama_lengkap: user.nama_lengkap, email: user.email, role: user.role, avatar: user.avatar, tema_pilihan: user.tema_pilihan }
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.' });
    }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, nama_lengkap, email, no_hp, kode_negara, avatar, tema_pilihan, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User tidak ditemukan.' });
        }
        res.json({ status: 'success', user: users[0] });
    } catch (error) {
        console.error('GetMe Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.' });
    }
};

module.exports = { register, login, getMe };

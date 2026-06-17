const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// @desc    Get overall platform statistics
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [[userStats]] = await db.query('SELECT COUNT(*) as total_users FROM users WHERE role = "user"');
        const [[txStats]] = await db.query('SELECT COUNT(*) as total_transaksi, COALESCE(SUM(nominal),0) as total_volume FROM transactions');
        const [[notifStats]] = await db.query('SELECT COUNT(*) as total_notifikasi FROM notifications');
        const [recentUsers] = await db.query(
            'SELECT id, nama_lengkap, email, role, created_at FROM users WHERE role = "user" ORDER BY created_at DESC LIMIT 5'
        );

        res.json({
            status: 'success',
            data: {
                total_users: userStats.total_users,
                total_transaksi: txStats.total_transaksi,
                total_volume: txStats.total_volume,
                total_notifikasi: notifStats.total_notifikasi,
                recent_users: recentUsers
            }
        });
    } catch (error) {
        console.error('Admin getStats error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil statistik.' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.id, u.nama_lengkap, u.email, u.no_hp, u.role, u.created_at,
                COUNT(DISTINCT t.id) as total_transaksi,
                COALESCE(SUM(CASE WHEN t.tipe='pemasukan' THEN t.nominal ELSE 0 END),0) as total_pemasukan,
                COALESCE(SUM(CASE WHEN t.tipe='pengeluaran' THEN t.nominal ELSE 0 END),0) as total_pengeluaran
             FROM users u
             LEFT JOIN transactions t ON t.user_id = u.id
             GROUP BY u.id
             ORDER BY u.created_at DESC`
        );
        res.json({ status: 'success', data: users });
    } catch (error) {
        console.error('Admin getAllUsers error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data pengguna.' });
    }
};

// @desc    Delete a user (and all their data via CASCADE)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    const { id } = req.params;
    // Prevent deleting another admin
    try {
        const [[user]] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
        if (!user) return res.status(404).json({ status: 'error', message: 'User tidak ditemukan.' });
        if (user.role === 'admin') return res.status(403).json({ status: 'error', message: 'Tidak bisa menghapus akun admin.' });

        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Akun pengguna berhasil dihapus.' });
    } catch (error) {
        console.error('Admin deleteUser error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal menghapus pengguna.' });
    }
};

// @desc    Broadcast notification to one or all users
// @route   POST /api/admin/broadcast
const broadcastNotifikasi = async (req, res) => {
    const { judul, pesan, target } = req.body; // target: 'all' or user_id number
    if (!judul || !pesan) {
        return res.status(400).json({ status: 'error', message: 'Judul dan pesan wajib diisi.' });
    }

    try {
        if (target === 'all') {
            // Get all non-admin users
            const [users] = await db.query('SELECT id FROM users WHERE role = "user"');
            if (users.length === 0) {
                return res.json({ status: 'success', message: 'Tidak ada pengguna untuk menerima notifikasi.' });
            }
            const values = users.map(u => [u.id, judul, pesan]);
            await db.query('INSERT INTO notifications (user_id, judul, pesan) VALUES ?', [values]);
            res.json({ status: 'success', message: `Notifikasi berhasil dikirim ke ${users.length} pengguna.` });
        } else {
            const userId = parseInt(target);
            if (isNaN(userId)) return res.status(400).json({ status: 'error', message: 'Target user tidak valid.' });
            await db.query('INSERT INTO notifications (user_id, judul, pesan) VALUES (?, ?, ?)', [userId, judul, pesan]);
            res.json({ status: 'success', message: 'Notifikasi berhasil dikirim ke pengguna.' });
        }
    } catch (error) {
        console.error('Admin broadcastNotifikasi error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengirim notifikasi.' });
    }
};

// @desc    Get server access logs
// @route   GET /api/admin/logs
const getLogs = async (req, res) => {
    try {
        const logFile = path.join(__dirname, '..', 'logs', 'access.log');
        if (!fs.existsSync(logFile)) {
            return res.json({ status: 'success', data: [], message: 'Log file belum ada.' });
        }
        const content = fs.readFileSync(logFile, 'utf8');
        // Return last 200 lines reversed (newest first)
        const lines = content.trim().split('\n').filter(Boolean).reverse().slice(0, 200);
        res.json({ status: 'success', data: lines });
    } catch (error) {
        console.error('Admin getLogs error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal membaca log server.' });
    }
};

// @desc    Promote user to admin or demote to user
// @route   PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ status: 'error', message: 'Role tidak valid.' });
    }
    try {
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ status: 'success', message: `Role pengguna berhasil diubah menjadi ${role}.` });
    } catch (error) {
        console.error('Admin updateRole error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal memperbarui role.' });
    }
};

module.exports = { getStats, getAllUsers, deleteUser, broadcastNotifikasi, getLogs, updateUserRole };

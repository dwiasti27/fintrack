const db = require('../config/db');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifikasi
const getNotifikasi = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [req.user.id]
        );
        const unreadCount = rows.filter(n => !n.is_read).length;
        res.json({ status: 'success', data: rows, unread_count: unreadCount });
    } catch (error) {
        console.error('GetNotifikasi Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil notifikasi.' });
    }
};

// @desc    Mark one notification as read
// @route   PUT /api/notifikasi/:id/read
const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        res.json({ status: 'success', message: 'Notifikasi ditandai sebagai dibaca.' });
    } catch (error) {
        console.error('MarkAsRead Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal memperbarui notifikasi.' });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifikasi/read-all
const markAllAsRead = async (req, res) => {
    try {
        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
            [req.user.id]
        );
        res.json({ status: 'success', message: 'Semua notifikasi ditandai dibaca.' });
    } catch (error) {
        console.error('MarkAllAsRead Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal memperbarui notifikasi.' });
    }
};

// @desc    Delete one notification
// @route   DELETE /api/notifikasi/:id
const deleteNotifikasi = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        res.json({ status: 'success', message: 'Notifikasi dihapus.' });
    } catch (error) {
        console.error('DeleteNotifikasi Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal menghapus notifikasi.' });
    }
};

// @desc    Delete all notifications for user
// @route   DELETE /api/notifikasi
const deleteAllNotifikasi = async (req, res) => {
    try {
        await db.query('DELETE FROM notifications WHERE user_id = ?', [req.user.id]);
        res.json({ status: 'success', message: 'Semua notifikasi dihapus.' });
    } catch (error) {
        console.error('DeleteAllNotifikasi Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal menghapus notifikasi.' });
    }
};

module.exports = { getNotifikasi, markAsRead, markAllAsRead, deleteNotifikasi, deleteAllNotifikasi };

const db = require('../config/db');

// @desc    Get all categories (default + user's custom)
// @route   GET /api/kategori
const getKategori = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM categories WHERE user_id IS NULL OR user_id = ? ORDER BY tipe, nama_kategori',
            [req.user.id]
        );
        res.json({ status: 'success', data: rows });
    } catch (error) {
        console.error('GetKategori Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data kategori.' });
    }
};

// @desc    Add custom category
// @route   POST /api/kategori
const addKategori = async (req, res) => {
    const { nama_kategori, icon, tipe, warna } = req.body;
    if (!nama_kategori || !icon || !tipe) {
        return res.status(400).json({ status: 'error', message: 'Nama, icon, dan tipe wajib diisi.' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO categories (user_id, nama_kategori, icon, tipe, warna) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, nama_kategori, icon, tipe, warna || '#64748B']
        );
        res.status(201).json({ status: 'success', message: 'Kategori berhasil ditambahkan!', id: result.insertId });
    } catch (error) {
        console.error('AddKategori Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal menambahkan kategori.' });
    }
};

// @desc    Delete custom category
// @route   DELETE /api/kategori/:id
const deleteKategori = async (req, res) => {
    const { id } = req.params;
    try {
        const [existing] = await db.query('SELECT id FROM categories WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Kategori tidak ditemukan atau tidak bisa dihapus (kategori default).' });
        }
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Kategori berhasil dihapus.' });
    } catch (error) {
        console.error('DeleteKategori Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal menghapus kategori.' });
    }
};

// @desc    Get spending analytics per category
// @route   GET /api/kategori/analitik
const getAnalitikKategori = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;
        let whereClause = 'WHERE t.user_id = ?';
        const params = [req.user.id];

        if (bulan && tahun) {
            whereClause += ' AND MONTH(t.tanggal) = ? AND YEAR(t.tanggal) = ?';
            params.push(bulan, tahun);
        }

        const [rows] = await db.query(`
            SELECT c.id, c.nama_kategori, c.icon, c.warna, c.tipe,
                   SUM(t.nominal) AS total,
                   COUNT(t.id) AS jumlah_transaksi
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            ${whereClause}
            GROUP BY c.id
            ORDER BY total DESC
        `, params);

        res.json({ status: 'success', data: rows });
    } catch (error) {
        console.error('GetAnalitik Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data analitik.' });
    }
};

module.exports = { getKategori, addKategori, deleteKategori, getAnalitikKategori };

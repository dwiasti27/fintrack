const db = require('../config/db');

// @desc    Get all transactions for logged-in user
// @route   GET /api/transaksi
const getTransaksi = async (req, res) => {
    try {
        const { bulan, tahun, tipe, category_id } = req.query;
        let query = `
            SELECT t.*, c.nama_kategori, c.icon, c.warna 
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
        `;
        const params = [req.user.id];

        if (bulan && tahun) {
            query += ' AND MONTH(t.tanggal) = ? AND YEAR(t.tanggal) = ?';
            params.push(bulan, tahun);
        }
        if (tipe) {
            query += ' AND t.tipe = ?';
            params.push(tipe);
        }
        if (category_id) {
            query += ' AND t.category_id = ?';
            params.push(category_id);
        }
        query += ' ORDER BY t.tanggal DESC, t.created_at DESC';

        const [rows] = await db.query(query, params);
        res.json({ status: 'success', data: rows });
    } catch (error) {
        console.error('GetTransaksi Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data transaksi.' });
    }
};

// @desc    Get financial summary (saldo, pemasukan, pengeluaran)
// @route   GET /api/transaksi/summary
const getSummary = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;
        let whereClause = 'WHERE user_id = ?';
        const params = [req.user.id];

        if (bulan && tahun) {
            whereClause += ' AND MONTH(tanggal) = ? AND YEAR(tanggal) = ?';
            params.push(bulan, tahun);
        }

        const [rows] = await db.query(`
            SELECT 
                SUM(CASE WHEN tipe = 'pemasukan' THEN nominal ELSE 0 END) AS total_pemasukan,
                SUM(CASE WHEN tipe = 'pengeluaran' THEN nominal ELSE 0 END) AS total_pengeluaran,
                SUM(CASE WHEN tipe = 'pemasukan' THEN nominal ELSE -nominal END) AS saldo
            FROM transactions ${whereClause}
        `, params);

        res.json({ status: 'success', data: rows[0] });
    } catch (error) {
        console.error('GetSummary Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil summary.' });
    }
};

// @desc    Add new transaction
// @route   POST /api/transaksi
const addTransaksi = async (req, res) => {
    const { judul, nominal, tipe, category_id, catatan, tanggal } = req.body;

    if (!judul || !nominal || !tipe || !category_id || !tanggal) {
        return res.status(400).json({ status: 'error', message: 'Semua kolom wajib diisi.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO transactions (user_id, category_id, judul, nominal, tipe, catatan, tanggal) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, category_id, judul, nominal, tipe, catatan || null, tanggal]
        );

        const [newTx] = await db.query(`
            SELECT t.*, c.nama_kategori, c.icon, c.warna 
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?
        `, [result.insertId]);

        res.status(201).json({ status: 'success', message: 'Transaksi berhasil ditambahkan!', data: newTx[0] });
    } catch (error) {
        console.error('AddTransaksi Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal menambahkan transaksi.' });
    }
};

// @desc    Get single transaction by ID
// @route   GET /api/transaksi/:id
const getTransaksiById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT t.*, c.nama_kategori, c.icon, c.warna, c.tipe as kategori_tipe
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ? AND t.user_id = ?
        `, [id, req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Transaksi tidak ditemukan.' });
        }
        res.json({ status: 'success', data: rows[0] });
    } catch (error) {
        console.error('GetTransaksiById Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil detail transaksi.' });
    }
};

// @desc    Get cash flow per day for line chart
// @route   GET /api/transaksi/analitik/arus-kas
const getArusKas = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;
        const now = new Date();
        const m = bulan || (now.getMonth() + 1);
        const y = tahun || now.getFullYear();

        const [rows] = await db.query(`
            SELECT 
                DAY(tanggal) as hari,
                SUM(CASE WHEN tipe = 'pemasukan' THEN nominal ELSE 0 END) AS pemasukan,
                SUM(CASE WHEN tipe = 'pengeluaran' THEN nominal ELSE 0 END) AS pengeluaran
            FROM transactions
            WHERE user_id = ? AND MONTH(tanggal) = ? AND YEAR(tanggal) = ?
            GROUP BY DAY(tanggal)
            ORDER BY hari ASC
        `, [req.user.id, m, y]);

        res.json({ status: 'success', data: rows, bulan: m, tahun: y });
    } catch (error) {
        console.error('GetArusKas Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data arus kas.' });
    }
};

// @desc    Get spending breakdown per category for pie/doughnut chart
// @route   GET /api/transaksi/analitik/kategori-pie
const getKategoriPie = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;
        const now = new Date();
        const m = bulan || (now.getMonth() + 1);
        const y = tahun || now.getFullYear();

        const [rows] = await db.query(`
            SELECT 
                c.nama_kategori,
                c.icon,
                c.warna,
                SUM(t.nominal) AS total
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND t.tipe = 'pengeluaran'
              AND MONTH(t.tanggal) = ? AND YEAR(t.tanggal) = ?
            GROUP BY t.category_id
            ORDER BY total DESC
        `, [req.user.id, m, y]);

        const grandTotal = rows.reduce((sum, r) => sum + parseFloat(r.total), 0);
        const data = rows.map(r => ({
            ...r,
            persen: grandTotal > 0 ? Math.round((parseFloat(r.total) / grandTotal) * 100) : 0
        }));

        res.json({ status: 'success', data, grand_total: grandTotal });
    } catch (error) {
        console.error('GetKategoriPie Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data kategori.' });
    }
};

// @desc    Update transaction
// @route   PUT /api/transaksi/:id
const updateTransaksi = async (req, res) => {
    const { id } = req.params;
    const { judul, nominal, tipe, category_id, catatan, tanggal } = req.body;

    try {
        // Check ownership
        const [existing] = await db.query('SELECT id FROM transactions WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Transaksi tidak ditemukan.' });
        }

        await db.query(
            'UPDATE transactions SET judul=?, nominal=?, tipe=?, category_id=?, catatan=?, tanggal=? WHERE id=?',
            [judul, nominal, tipe, category_id, catatan || null, tanggal, id]
        );

        res.json({ status: 'success', message: 'Transaksi berhasil diperbarui!' });
    } catch (error) {
        console.error('UpdateTransaksi Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal memperbarui transaksi.' });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transaksi/:id
const deleteTransaksi = async (req, res) => {
    const { id } = req.params;
    try {
        const [existing] = await db.query('SELECT id FROM transactions WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Transaksi tidak ditemukan.' });
        }
        await db.query('DELETE FROM transactions WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Transaksi berhasil dihapus.' });
    } catch (error) {
        console.error('DeleteTransaksi Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Gagal menghapus transaksi.' });
    }
};

module.exports = { getTransaksi, getSummary, getTransaksiById, addTransaksi, updateTransaksi, deleteTransaksi, getArusKas, getKategoriPie };

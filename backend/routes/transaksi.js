const express = require('express');
const router = express.Router();
const { getTransaksi, getSummary, getTransaksiById, addTransaksi, updateTransaksi, deleteTransaksi, getArusKas, getKategoriPie } = require('../controllers/transaksiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All transaksi routes require authentication

router.get('/summary', getSummary);
router.get('/analitik/arus-kas', getArusKas);
router.get('/analitik/kategori-pie', getKategoriPie);
router.get('/', getTransaksi);
router.get('/:id', getTransaksiById);
router.post('/', addTransaksi);
router.put('/:id', updateTransaksi);
router.delete('/:id', deleteTransaksi);

module.exports = router;

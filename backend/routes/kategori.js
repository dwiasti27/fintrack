const express = require('express');
const router = express.Router();
const { getKategori, addKategori, deleteKategori, getAnalitikKategori } = require('../controllers/kategoriController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analitik', getAnalitikKategori);
router.get('/', getKategori);
router.post('/', addKategori);
router.delete('/:id', deleteKategori);

module.exports = router;

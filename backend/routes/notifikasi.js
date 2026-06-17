const express = require('express');
const router = express.Router();
const { getNotifikasi, markAsRead, markAllAsRead, deleteNotifikasi, deleteAllNotifikasi } = require('../controllers/notifikasiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getNotifikasi);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/', deleteAllNotifikasi);
router.delete('/:id', deleteNotifikasi);

module.exports = router;

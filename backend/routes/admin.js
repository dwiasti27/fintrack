const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
    getStats,
    getAllUsers,
    deleteUser,
    broadcastNotifikasi,
    getLogs,
    updateUserRole
} = require('../controllers/adminController');

// All admin routes require: valid JWT + role admin
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.post('/broadcast', broadcastNotifikasi);
router.get('/logs', getLogs);

module.exports = router;

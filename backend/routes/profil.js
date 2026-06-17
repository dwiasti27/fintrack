const express = require('express');
const router = express.Router();
const { getProfil, updateProfil, updatePassword } = require('../controllers/profilController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getProfil);
router.put('/', updateProfil);
router.put('/password', updatePassword);

module.exports = router;

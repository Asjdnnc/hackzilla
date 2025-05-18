const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
//router.get('/me', protect, getCurrentUser);
router.get('/me', getCurrentUser);
module.exports = router;
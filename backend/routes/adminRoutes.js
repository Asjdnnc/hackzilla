const express = require('express');
const router = express.Router();
const { getAdminStats, getFoodStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth'); // Assuming authorize middleware exists or will be created

// Protect all admin routes
router.use(protect);

// Get overall admin statistics
router.get('/stats', authorize('admin'), getAdminStats);

// Get food statistics
router.get('/food-stats', authorize('admin', 'volunteer'), getFoodStats);

module.exports = router; 
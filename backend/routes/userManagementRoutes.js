const express = require('express');
const { createUser, getAllUsers } = require('../controllers/userManagementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.route('/')
  .post(authorize('admin'), createUser)
  .get(authorize('admin'), getAllUsers);

module.exports = router;
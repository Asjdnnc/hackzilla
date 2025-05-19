const express = require('express');
const { 
  createTeam, 
  getAllTeams, 
  getTeamById, 
  updateTeam, 
  deleteTeam, 
  scanQRCode, 
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllTeams);
router.post('/', createTeam);

// Protected routes (require authentication)
router.use(protect);

// Admin and volunteer routes
router.post('/scan', authorize('admin', 'volunteer'), scanQRCode);

// Admin only routes
router.use(authorize('admin'));

router.get('/:id', getTeamById);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);



module.exports = router;
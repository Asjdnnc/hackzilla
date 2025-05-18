const User = require('../models/User');
const Team = require('../models/Team');

// Create new admin or volunteer account (admin only)
exports.createUser = async (req, res) => {
  try {
    // Only admins can create new users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create users'
      });
    }

    const { username, password, role } = req.body;

    // Validate role
    if (!['admin', 'volunteer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      role,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Only admins can view all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all users'
      });
    }

    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, leader, members } = req.body;

    // Log incoming data
    console.log('Received team data:', { name, leader, members });

    // Count existing teams
    const count = await Team.countDocuments();
    // Team ID starts from 2501
    const id = (2501 + count).toString();

    // Create team
    const team = await Team.create({
      id,
      name,
      leader,
      members: members.map(m => ({
        name: m.name,
        collegeName: m.college,
        isFromIIITS: !!m.isFromIIITS
      })),
      status: 'inactive',
      foodStatus: {
        lunch: 'invalid',
        dinner: 'invalid',
        snacks: 'invalid'
      }
    });

    // Log the saved team
    console.log('Saved team:', team);

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    // Log the error
    console.error('Error saving team:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
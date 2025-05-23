const Team = require('../models/Team');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { validateObjectId } = require('../utils/validators');

// Create team
exports.createTeam = async (req, res) => {
  try {
    const { name, leader, members} = req.body;

    // Validate required fields (basic check before Mongoose validation)
    if (!name || !leader || !members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, leader, and at least one member are required'
      });
    }

    // Generate sequential teamId
    let nextTeamIdNumber = 1; // Starting number for 25xx sequence
    const lastTeam = await Team.findOne({ teamId: /^25\d{2}$/ })
      .sort({ teamId: -1 })
      .limit(1);

    if (lastTeam && lastTeam.teamId) {
      // Extract the last two digits
      const lastIdNumber = parseInt(lastTeam.teamId.substring(2));
      if (!isNaN(lastIdNumber) && lastIdNumber >= 0 && lastIdNumber <= 99) { 
         nextTeamIdNumber = lastIdNumber + 1;
      } else {
        // Fallback or warning if the last ID format is unexpected (shouldn't happen with regex filter)
        console.warn(`Unexpected last teamId format: ${lastTeam.teamId}. Starting sequence from 2501.`);
         nextTeamIdNumber = 1; // Start from 2501 if format is wrong
      }
    }

    // Format the next teamId as a 4-digit string starting with 25
    // Ensure the sequential number doesn't exceed 99 for the 25xx format
    if (nextTeamIdNumber > 99) {
         // Handle the case where all 2500-2599 IDs are used
         return res.status(507).json({ success: false, message: 'All possible team IDs in the 25xx range have been used.' });
    }
    const teamId = `25${nextTeamIdNumber.toString().padStart(2, '0')}`;

    // Optional: Check for potential duplicates in a high-concurrency scenario
    const existingTeam = await Team.findOne({ teamId });
    if (existingTeam) {
        // This is a rare race condition, log and potentially retry or handle as a duplicate
        console.error(`Race condition detected: Generated teamId ${teamId} already exists.`);
        return res.status(500).json({ success: false, message: 'Failed to generate unique team ID. Please try again.' });
    }

    // Create initial team document with generated sequential teamId
    const newTeam = new Team({
      teamId, // Assign the generated teamId
      name,
      leader,
      members: members.map(m => ({
        name: m.name,
        collegeName: m.collegeName,
        isFromIIITS: !!m.isFromIIITS
      })),
      status: 'invalid', // Set initial status to 'invalid'
      foodStatus: {
        lunch: 'invalid',
        dinner: 'invalid',
        snacks: 'invalid'
      },
      // Initialize allotment status, use provided status if valid, otherwise default
      allotment: 'invalid',
    });

    // Construct the data object specifically for the QR code
    const qrDataObject = {
      teamId: newTeam.teamId,
      teamName: name,
      leader: leader,
      members: members.map(m => ({
        name: m.name,
        collegeName: m.collegeName,
        isFromIIITS: !!m.isFromIIITS
      })),
      status: newTeam.status,
      foodStatus: newTeam.foodStatus,
      allotment: newTeam.allotment,
      createdAt: new Date().toISOString()
    };

    // Generate QR data string
    const qrData = JSON.stringify(qrDataObject);

    // Assign qrData to the team document
    newTeam.qrData = qrData;

    await newTeam.save();

    res.status(201).json({
      success: true,
      data: newTeam,
      message: `Team "${newTeam.name}" created successfully with ID: ${newTeam.teamId}`
    });

  } catch (err) {
    console.error('Error creating team:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: `Team validation failed: ${err.message}`
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `A team with this ${field} already exists. Please choose a different ${field}.`
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create team'
    });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Error in getAllTeams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message
    });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findOne({ teamId: req.params.id });
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, leader, status, members, foodStatus, allotment, lunchcount, dinnercount, snackscount } = req.body;
    
    // Find team by teamId instead of _id
    const team = await Team.findOne({ teamId: id });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    // Validate required fields
    if (!name || !leader) {
      return res.status(400).json({
        success: false,
        message: 'Name and leader are required'
      });
    }

    // Validate members if provided
    if (members) {
      if (!Array.isArray(members)) {
        return res.status(400).json({
          success: false,
          message: 'Members must be an array'
        });
      }

      const invalidMembers = members.some(m => !m.name || !m.collegeName);
      if (invalidMembers) {
        return res.status(400).json({
          success: false,
          message: 'All members must have a name and college name'
        });
      }
    }

    // Validate status if provided
    if (status && !['valid', 'invalid'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be \'valid\' or \'invalid\'.'
      });
    }
    
    // Update team fields
    team.name = name;
    team.leader = leader;
    if (status) team.status = status;
    if (members) {
      team.members = members.map(m => ({
        name: m.name,
        collegeName: m.collegeName,
        isFromIIITS: !!m.isFromIIITS
      }));
    }
    if (foodStatus) team.foodStatus = foodStatus;
    if (allotment) team.allotment = allotment;
    
    // Update count fields
    if (lunchcount !== undefined) team.lunchcount = parseInt(lunchcount) || 0;
    if (dinnercount !== undefined) team.dinnercount = parseInt(dinnercount) || 0;
    if (snackscount !== undefined) team.snackscount = parseInt(snackscount) || 0;

    // Update QR data
    const qrDataObject = {
      teamId: team.teamId,
      teamName: team.name,
      leader: team.leader,
      members: team.members,
      status: team.status,
      foodStatus: team.foodStatus,
      allotment: team.allotment,
      lunchcount: team.lunchcount,
      dinnercount: team.dinnercount,
      snackscount: team.snackscount,
      createdAt: team.createdAt
    };
    team.qrData = JSON.stringify(qrDataObject);

    await team.save();

    res.status(200).json({
      success: true,
      data: team,
      message: 'Team updated successfully'
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update team'
    });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID format'
    });
  }

    // Use findByIdAndDelete to delete by MongoDB _id
    const team = await Team.findByIdAndDelete(id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    
    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTeam:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete team' });
  }
};

// Generate QR code image
exports.generateQRCode = async (req, res) => {
  try {
    const team = await Team.findOne({ teamId: req.params.id });
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const qrCodeDataURL = await QRCode.toDataURL(team.qrData);
    res.status(200).json({ success: true, qrCode: qrCodeDataURL });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Scan QR and update status or food
exports.scanQRCode = async (req, res) => {
  try {
    const { qrData, action } = req.body;
    let teamData;
    try {
      teamData = JSON.parse(qrData);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid QR data' });
    }
    
    const team = await Team.findOne({ teamId: teamData.teamId });
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    
    // Only allow status change if current status is invalid
    if (action === 'check-in') {
      if (team.status === 'invalid') {
        team.status = 'valid';
        // Optionally initialize food status to invalid upon check-in if not already
         if (!team.foodStatus) {
             team.foodStatus = { lunch: 'invalid', dinner: 'invalid', snacks: 'invalid' };
         }
      } else { // Status is already valid
          return res.status(400).json({ success: false, message: 'Team already has VALID status' });
      }
    } else if (['lunch', 'dinner', 'snacks'].includes(action)) { // Check if action is a valid food type
      // Allow food status update only if team status is valid
      if (team.status === 'valid') {
        // Ensure the foodStatus object exists
        if (!team.foodStatus) {
          team.foodStatus = { lunch: 'invalid', dinner: 'invalid', snacks: 'invalid' };
        }
        // Only change food status from invalid to valid
        if (team.foodStatus[action] === 'invalid') {
           team.foodStatus[action] = 'valid';
        } else {
           return res.status(400).json({ success: false, message: `${action.charAt(0).toUpperCase() + action.slice(1)} status is already VALID` });
        }
      } else {
          return res.status(400).json({ success: false, message: 'Team must have VALID status to update food status' });
      }
    } else if (action === 'allotment') { // Handle allotment status update
         if (team.status === 'valid') { // Typically allotment would require valid team status
             // Ensure the allotment object exists (based on model schema, it should)
             if (!team.allotment) {
                 // Initialize as string if null/undefined
                 team.allotment = 'invalid';
             }
             // Only change allotment status from invalid to valid
             if (team.allotment === 'invalid') {
                team.allotment = 'valid';
             } else {
                return res.status(400).json({ success: false, message: 'Allotment status is already VALID' });
             }
         } else {
             return res.status(400).json({ success: false, message: 'Team must have valid status to update allotment status' });
         }

    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    // Do NOT regenerate qrData here as the physical QR code is static

    await team.save();
    res.status(200).json({
      success: true,
      message: `${action} processed successfully`,
      data: team
      });
  } catch (error) {
    console.error('Error scanning QR code:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to process QR scan' });
  }
};

// Update food status directly
exports.updateFoodStatus = async (req, res) => {
  try {
    const { teamId, foodType } = req.body;
    if (!['lunch', 'dinner', 'snacks'].includes(foodType)) {
      return res.status(400).json({ success: false, message: 'Invalid food type' });
    }
    
    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    
    // Allow food status update only if team status is valid
    if (team.status !== 'valid') {
      return res.status(400).json({ success: false, message: 'Team must have valid status to update food status' });
    }

    // Ensure the foodStatus object exists
    if (!team.foodStatus) {
      team.foodStatus = { lunch: 'invalid', dinner: 'invalid', snacks: 'invalid' };
    }
    // Toggle food status
    team.foodStatus[foodType] = team.foodStatus[foodType] === 'invalid' ? 'valid' : 'invalid';

    // Do NOT regenerate qrData here as the physical QR code is static

    await team.save();
    res.status(200).json({
      success: true,
      message: `${foodType} status updated to ${team.foodStatus[foodType]}`,
      data: team
    });
  } catch (error) {
    console.error('Error updating food status:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update food status' });
  }
};
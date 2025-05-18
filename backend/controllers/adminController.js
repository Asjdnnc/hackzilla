const Team = require('../models/Team');
const User = require('../models/User');

// Get overall admin statistics
exports.getAdminStats = async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    // Assuming 'active' status means approved for hackathon participation
    const approvedTeams = await Team.countDocuments({ status: 'active' });
    const pendingTeams = await Team.countDocuments({ status: 'inactive' });

    // Calculate total participants by summing the number of members in each team
    const teams = await Team.find({}, 'members'); // Only fetch members field
    const totalParticipants = teams.reduce((sum, team) => sum + team.members.length, 0);

    res.status(200).json({
      success: true,
      totalTeams,
      approvedTeams,
      pendingTeams,
      totalParticipants
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats'
    });
  }
};

// Get food statistics
exports.getFoodStats = async (req, res) => {
  try {
    const teams = await Team.find({}, 'foodStatus'); // Only fetch foodStatus field
    const totalTeams = teams.length;

    let servedBreakfast = 0;
    let servedLunch = 0;
    let servedDinner = 0;
    let servedSnacks = 0;

    teams.forEach(team => {
      if (team.foodStatus?.breakfast === 'valid') servedBreakfast++;
      if (team.foodStatus?.lunch === 'valid') servedLunch++;
      if (team.foodStatus?.dinner === 'valid') servedDinner++;
      if (team.foodStatus?.snacks === 'valid') servedSnacks++;
    });

    res.status(200).json({
      success: true,
      breakfast: { total: totalTeams, served: servedBreakfast },
      lunch: { total: totalTeams, served: servedLunch },
      dinner: { total: totalTeams, served: servedDinner },
      snacks: { total: totalTeams, served: servedSnacks }
    });
  } catch (error) {
    console.error('Error fetching food stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food stats'
    });
  }
}; 
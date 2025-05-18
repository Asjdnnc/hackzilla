/**
 * Helper functions for the Hackzilla application
 */

// Format date to a readable string
export const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Truncate text with ellipsis if it exceeds maxLength
  export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Generate a random team ID
  export const generateTeamId = () => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TEAM-${timestamp}-${random}`;
  };
  
  // Validate email format
  export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Check if all required fields in an object are filled
  export const areRequiredFieldsFilled = (obj, requiredFields) => {
    return requiredFields.every(field => {
      const value = obj[field];
      return value !== undefined && value !== null && value !== '';
    });
  };
  
  // Parse JWT token to get user info
  export const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
  
  // Check if token is expired
  export const isTokenExpired = (token) => {
    const decodedToken = parseJwt(token);
    if (!decodedToken) return true;
    
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };
  
  // Get user role from token
  export const getUserRoleFromToken = (token) => {
    const decodedToken = parseJwt(token);
    return decodedToken?.role || 'user';
  };
  
  // Format team status for display
  export const formatTeamStatus = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Approval';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };
  
  // Generate QR code data for a team
  export const generateQrData = (team) => {
    return JSON.stringify({
      teamId: team._id,
      teamName: team.teamName,
      collegeId: team.collegeId || ''
    });
  };
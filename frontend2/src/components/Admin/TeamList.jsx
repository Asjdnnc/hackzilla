import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Snackbar,
  Alert,
  Stack,
  Input,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  FormControlLabel,
  Checkbox,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { Search, Edit, QrCode, Delete as DeleteIcon, AddCircleOutline as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL;

const TeamList = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [teamToDeleteId, setTeamToDeleteId] = useState(null);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editedTeam, setEditedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const qrCodeRef = useRef(null);

  const cardSx = {
    background: 'rgba(30, 30, 30, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 3,
    color: '#fff',
    transition: 'transform 0.3s',
    backdropFilter: 'blur(10px)',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 6,
    },
  };

  const searchBoxSx = {
    mb: 4,
    maxWidth: '600px',
    mx: 'auto',
    position: 'relative',
    background: 'rgba(30,30,30,0.7)',
    borderRadius: '12px',
    boxShadow: 2,
    px: 2,
    py: 1,
    display: 'flex',
    alignItems: 'center',
  };

  const inputSx = {
    flex: 1,
    color: '#fff',
    pl: 2,
    background: 'transparent',
    border: 'none',
    fontSize: '1.1rem',
    '& input': {
      color: '#fff',
      background: 'transparent',
    },
    '&:before': {
      borderBottom: 'none',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
    '&:after': {
      borderBottom: '2px solid',
      borderColor: theme.palette.primary.main,
    },
  };

  const darkTableContainerStyle = {
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: theme.shadows[2],
    mt: 3,
    overflow: 'hidden'
  };

  const darkTableHeadCellStyle = {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  };

  const darkTableBodyCellStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchTeams();
    } else if (user === null) {
      navigate('/');
    }
  }, [user, navigate]);

    const fetchTeams = async () => {
      try {
      setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: {
          Authorization: `Bearer ${token}`,
        },
        };
      const res = await axios.get(`${API_URL}/api/teams`, config);
      if (Array.isArray(res.data.data)) {
        setTeams(res.data.data);
      } else {
        console.error('API returned non-array data for teams:', res.data);
        setTeams([]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams.');
      } finally {
        setLoading(false);
      }
    };

  const handleEditClick = (team) => {
    // Create a deep copy of the team to avoid direct state mutation
    const teamCopy = {
      _id: team._id,
      teamId: team.teamId,
      name: team.name || '',
      leader: team.leader || '',
      status: team.status || 'invalid',
      members: (team.members || []).map(member => ({
        name: member.name || '',
        collegeName: member.collegeName || '',
        isFromIIITS: Boolean(member.isFromIIITS)
      })),
      qrData: team.qrData,
      // Initialize foodStatus with default values if missing
      foodStatus: team.foodStatus ? { ...team.foodStatus } : { lunch: 'invalid', dinner: 'invalid', snacks: 'invalid' }
    };
    setSelectedTeam(team);
    setEditedTeam(teamCopy);
    setEditDialogOpen(true);
  };

  const handleViewClick = (team) => {
    setSelectedTeam(team);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (teamId) => {
    setTeamToDeleteId(teamId);
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/api/teams/${teamToDeleteId}`, config);
      showMessage('Team deleted successfully!', 'success');
      setConfirmDeleteDialogOpen(false);
      setTeamToDeleteId(null);
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      showMessage(error.response?.data?.message || 'Failed to delete team', 'error');
      setConfirmDeleteDialogOpen(false);
      setTeamToDeleteId(null);
    }
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteDialogOpen(false);
    setTeamToDeleteId(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedTeam(null);
    setEditedTeam(null);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedTeam(null);
  };

  const handleDownloadQr = () => {
    // Use the ref to access the QR code container
    const qrCodeContainer = qrCodeRef.current;

    if (qrCodeContainer) {
      // Find the SVG element within the container using the ref
      const qrCodeSvg = qrCodeContainer.querySelector('svg');

      if (qrCodeSvg) {
        const svgData = new XMLSerializer().serializeToString(qrCodeSvg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngFile;
          // Ensure selectedTeam and teamId exist before using them
          downloadLink.download = `team_${selectedTeam?.teamId || 'qr'}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        // Handle potential errors during image loading
        img.onerror = (err) => {
          console.error("Error loading SVG for canvas:", err);
          showMessage("Failed to generate QR code image.", 'error');
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      } else {
        console.error("SVG element not found within #team-qr-code");
        showMessage("QR code SVG not found.", 'error');
      }
    } else {
      console.error("QR code container element (#team-qr-code) not found.");
      showMessage("QR code container not found.", 'error');
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    console.log('Input change:', { name, value, type, checked, index }); // Debug log

    setEditedTeam(prev => {
      if (!prev) return prev;

      // Create a new copy of the team to ensure immutability
      const updatedTeam = { ...prev };

      // Handle team-level fields (name, leader, status)
      if (name === 'teamStatus') {
        updatedTeam.status = checked ? 'valid' : 'invalid';
      } else if (name === 'teamName' || name === 'teamLeader') {
        const fieldMap = {
          teamName: 'name',
          teamLeader: 'leader'
        };
        updatedTeam[fieldMap[name]] = value;
      }
      // Handle food status fields
      else if (name === 'foodLunch' || name === 'foodDinner' || name === 'foodSnacks') {
          // Ensure foodStatus object exists
          if (!updatedTeam.foodStatus) {
              updatedTeam.foodStatus = { lunch: 'invalid', dinner: 'invalid', snacks: 'invalid' };
          }
           // Map form input name to food status property name and update
          const foodFieldMap = {
              foodLunch: 'lunch',
              foodDinner: 'dinner',
              foodSnacks: 'snacks'
          };
          const foodFieldName = foodFieldMap[name];
          if (foodFieldName) {
              updatedTeam.foodStatus[foodFieldName] = checked ? 'valid' : 'invalid';
          } else {
              console.error('Unknown food status input name:', name);
          }
      }
      // Handle member fields
      else if (typeof index === 'number') {
        // Ensure members array exists and create a mutable copy
        const updatedMembers = [...(updatedTeam.members || [])];

        // Ensure the member object exists at the index and create a mutable copy
        if (!updatedMembers[index]) {
          updatedMembers[index] = { name: '', collegeName: '', isFromIIITS: false };
        }
        const updatedMember = { ...updatedMembers[index] };

        // Map form input name to member object property name and update the specific field
        const memberFieldMap = {
          memberName: 'name',
          memberCollege: 'collegeName',
          memberIsFromIIITS: 'isFromIIITS'
        };
        const memberFieldName = memberFieldMap[name];

        if (memberFieldName) {
           // Update the specific field based on input type
          updatedMember[memberFieldName] = type === 'checkbox' ? checked : value;

          // Place the updated member object back into the updated members array
          updatedMembers[index] = updatedMember;

          // Update the team's members array with the new array
          updatedTeam.members = updatedMembers;

          console.log('Updated member:', updatedMember); // Debug log
        } else {
            console.error('Unknown member input name:', name); // Log unknown names
        }
      }

      console.log('Updated team:', updatedTeam); // Debug log
      return updatedTeam;
    });
  };

  const handleAddMember = () => {
    setEditedTeam(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        members: [
          ...(prev.members || []),
          { name: '', collegeName: '', isFromIIITS: false }
        ]
      };
    });
  };

  const handleRemoveMember = (index) => {
    setEditedTeam(prev => {
      if (!prev || !prev.members) return prev;
      const updatedMembers = [...prev.members];
      updatedMembers.splice(index, 1);
      return {
        ...prev,
        members: updatedMembers
      };
    });
  };

  const handleUpdateTeam = async () => {
    try {
      if (!editedTeam) {
        showMessage('No team data to update', 'error');
        return;
      }

      // Validate required fields
      if (!editedTeam.name?.trim()) {
        showMessage('Team name is required', 'error');
        return;
      }
      if (!editedTeam.leader?.trim()) {
        showMessage('Team leader is required', 'error');
        return;
      }

      // Validate members
      if (!editedTeam.members || !Array.isArray(editedTeam.members)) {
        showMessage('Invalid members data', 'error');
        return;
      }

      const invalidMembers = editedTeam.members.some(
        member => !member.name?.trim() || !member.collegeName?.trim()
      );
      if (invalidMembers) {
        showMessage('All members must have a name and college', 'error');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        showMessage('Authentication required', 'error');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Prepare the update data including foodStatus
      const updateData = {
        name: editedTeam.name.trim(),
        leader: editedTeam.leader.trim(),
        status: editedTeam.status,
        members: editedTeam.members.map(member => ({
          name: member.name.trim(),
          collegeName: member.collegeName.trim(),
          isFromIIITS: Boolean(member.isFromIIITS)
        })),
        // Include foodStatus
        foodStatus: editedTeam.foodStatus || { lunch: 'invalid', dinner: 'invalid', snacks: 'invalid' }
      };

      console.log('Updating team with data:', updateData); // Debug log

      // Use teamId instead of _id for the update
      const response = await axios.put(
        `${API_URL}/api/teams/${editedTeam.teamId}`,
        updateData,
        config
      );

      if (response.data?.success) {
        showMessage('Team updated successfully!', 'success');
        handleCloseEditDialog();
        fetchTeams(); // Refresh the team list
      } else {
        throw new Error(response.data?.message || 'Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update team';
      showMessage(errorMessage, 'error');
    }
  };

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getStatusChip = (status) => {
    const statusColor = status === 'valid' ? '#4caf50' : '#f44336';
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        sx={{ bgcolor: statusColor, color: '#fff', fontWeight: 600 }}
      />
    );
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.teamId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#fff',
      py: 6,
    }}>
    <Container maxWidth="lg">
        <Typography
          variant={isDesktop ? 'h3' : 'h4'}
          sx={{
            mb: 4,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #03dac6, #018786)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          Manage Teams
        </Typography>
        
        <Box sx={searchBoxSx}>
          <Search sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Input
            fullWidth
            disableUnderline
            placeholder="Search teams by name, leader, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={inputSx}
          />
        </Box>
        
        {isDesktop ? (
          <TableContainer component={Paper} sx={darkTableContainerStyle}>
            <Table aria-label="teams table">
              <TableHead>
                <TableRow>
                  <TableCell sx={darkTableHeadCellStyle}>Team ID</TableCell>
                  <TableCell sx={darkTableHeadCellStyle}>Name</TableCell>
                  <TableCell sx={darkTableHeadCellStyle}>Leader</TableCell>
                  <TableCell sx={darkTableHeadCellStyle}>Status</TableCell>
                  <TableCell sx={darkTableHeadCellStyle}>Members</TableCell>
                  <TableCell sx={darkTableHeadCellStyle} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(searchQuery ? filteredTeams : teams).map((team) => (
                  <TableRow key={team._id}>
                    <TableCell sx={darkTableBodyCellStyle}>{team.teamId}</TableCell>
                    <TableCell sx={darkTableBodyCellStyle}>{team.name}</TableCell>
                    <TableCell sx={darkTableBodyCellStyle}>{team.leader}</TableCell>
                    <TableCell sx={darkTableBodyCellStyle}>{getStatusChip(team.status)}</TableCell>
                    <TableCell sx={darkTableBodyCellStyle}>{team.members.length}</TableCell>
                    <TableCell sx={darkTableBodyCellStyle} align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewClick(team)}
                          sx={{
                            color: theme.palette.info.main,
                            borderColor: theme.palette.info.main,
                            '&:hover': { borderColor: theme.palette.info.light }
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditClick(team)}
                          sx={{
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.primary.main,
                            '&:hover': { borderColor: theme.palette.primary.light }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(team._id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container spacing={4}>
            {(searchQuery ? filteredTeams : teams).map((team) => (
              <Grid item xs={12} md={4} lg={3} key={team._id}>
                <Card sx={cardSx}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 600 }}>
                      {team.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                      Leader: {team.leader}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                      Team ID: {team.teamId}
                    </Typography>
      
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {getStatusChip(team.status)}
                      <Chip 
                        label={`Members: ${team.members.length}`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} 
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewClick(team)}
                        sx={{ 
                          color: theme.palette.info.main,
                          borderColor: theme.palette.info.main,
                          '&:hover': { borderColor: theme.palette.info.light }
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditClick(team)}
                        sx={{ 
                          color: theme.palette.primary.main,
                          borderColor: theme.palette.primary.main,
                          '&:hover': { borderColor: theme.palette.primary.light }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(team._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} PaperProps={{ sx: cardSx }} fullWidth maxWidth="md">
          <DialogTitle sx={{ color: theme.palette.primary.main }}>Edit Team Details</DialogTitle>
          <DialogContent>
            {editedTeam && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Team Name"
                    name="teamName"
                    value={editedTeam.name || ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ sx: { color: '#fff' } }}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Leader"
                    name="teamLeader"
                    value={editedTeam.leader || ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ sx: { color: '#fff' } }}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editedTeam.status === 'valid'}
                        onChange={handleInputChange}
                        name="teamStatus"
                        color="primary"
                        sx={{ color: theme.palette.primary.main }}
                      />
                    }
                    label="Team is Valid"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                    Food Status
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedTeam.foodStatus?.lunch === 'valid'}
                          onChange={handleInputChange}
                          name="foodLunch"
                          color="primary"
                          sx={{ color: theme.palette.primary.main }}
                        />
                      }
                      label="Lunch"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedTeam.foodStatus?.dinner === 'valid'}
                          onChange={handleInputChange}
                          name="foodDinner"
                          color="primary"
                          sx={{ color: theme.palette.primary.main }}
                        />
                      }
                      label="Dinner"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedTeam.foodStatus?.snacks === 'valid'}
                          onChange={handleInputChange}
                          name="foodSnacks"
                          color="primary"
                          sx={{ color: theme.palette.primary.main }}
                        />
                      }
                      label="Snacks"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main, mt: 2, mb: 1 }}>
                    Members
                  </Typography>
                  {(editedTeam.members || []).map((member, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2, p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          required
                          fullWidth
                          label={`Member ${index + 1} Name`}
                          name="memberName"
                          value={member.name || ''}
                          onChange={(e) => handleInputChange(e, index)}
                          variant="outlined"
                          size="small"
                          InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                          InputProps={{ sx: { color: '#fff' } }}
                          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          required
                          fullWidth
                          label={`Member ${index + 1} College`}
                          name="memberCollege"
                          value={member.collegeName || ''}
                          onChange={(e) => handleInputChange(e, index)}
                          variant="outlined"
                          size="small"
                          InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                          InputProps={{ sx: { color: '#fff' } }}
                          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(member.isFromIIITS)}
                              onChange={(e) => handleInputChange(e, index)}
                              name="memberIsFromIIITS"
                              color="primary"
                              sx={{ color: theme.palette.primary.main }}
                            />
                          }
                          label="IIITS"
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        />
                        <IconButton
                          onClick={() => handleRemoveMember(index)}
                          color="error"
                          size="small"
                          disabled={(editedTeam.members || []).length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddMember}
                    variant="outlined"
                    sx={{ mt: 2, color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
                  >
                    Add Member
                  </Button>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
            <Button
              onClick={handleUpdateTeam}
              color="primary"
              variant="contained"
              disabled={!editedTeam?.name?.trim() || !editedTeam?.leader?.trim() || (editedTeam.members || []).some(m => !m.name?.trim() || !m.collegeName?.trim())}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} PaperProps={{ sx: cardSx }} fullWidth maxWidth="sm">
          <DialogTitle sx={{ color: theme.palette.info.main }}>Team Details</DialogTitle>
          <DialogContent>
            {selectedTeam && (
              <Box sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}
                  id="team-qr-code"
                  ref={qrCodeRef}
                >
                  <QRCode
                    value={selectedTeam.qrData}
                    size={200}
                    level="H"
                    includeMargin={true}
                    renderAs="svg"
                  />
                  <Button
                    variant="contained"
                    startIcon={<QrCode />}
                    onClick={handleDownloadQr}
                    sx={{ mt: 2, bgcolor: theme.palette.secondary.main, '&:hover': { bgcolor: theme.palette.secondary.dark } }}
                  >
                    Download QR Code
                  </Button>
                </Box>

                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 600 }}>{selectedTeam.name}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>Leader: <b>{selectedTeam.leader}</b></Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Team ID: {selectedTeam.teamId}</Typography>

                <Typography variant="subtitle2" sx={{ color: theme.palette.secondary.main, fontWeight: 700, mb: 1 }}>
                  Status: {getStatusChip(selectedTeam.status)}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: theme.palette.secondary.main, fontWeight: 700, mt: 2, mb: 1 }}>
                  Food Status:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={`Lunch: ${selectedTeam.foodStatus?.lunch || '-'}`} size="small" sx={{ bgcolor: selectedTeam.foodStatus?.lunch === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                  <Chip label={`Dinner: ${selectedTeam.foodStatus?.dinner || '-'}`} size="small" sx={{ bgcolor: selectedTeam.foodStatus?.dinner === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                  <Chip label={`Snacks: ${selectedTeam.foodStatus?.snacks || '-'}`} size="small" sx={{ bgcolor: selectedTeam.foodStatus?.snacks === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                </Stack>

                <Typography variant="subtitle2" sx={{ color: theme.palette.secondary.main, fontWeight: 700, mb: 1 }}>Members:</Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {selectedTeam.members.map((m, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>{m.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>{m.collegeName}</Typography>
                      {m.isFromIIITS && (
                        <Chip label="IIIT Sonepat" size="small" sx={{ bgcolor: '#ff6600', color: '#fff', fontWeight: 700, ml: 1 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary" variant="outlined">Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseConfirmDelete} PaperProps={{ sx: cardSx }}>
            <DialogTitle sx={{ color: theme.palette.error.main }}>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this team?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirmDelete} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
                <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
            {message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default TeamList;
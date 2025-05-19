import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Input, CircularProgress, Box, Container, useTheme, useMediaQuery, Stack, IconButton, Button, Chip, Modal } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import QRCode from 'qrcode.react';

let API_URL = import.meta.env.VITE_API_URL;
const statCardSx = {
  height: '100%',
  background: 'rgba(30, 30, 30, 0.85)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 3,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: 6,
  },
};

const teamCardSx = {
  background: 'rgba(30, 30, 30, 0.85)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 3,
  color: '#fff',
  transition: 'transform 0.3s',
  backdropFilter: 'blur(10px)',
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
    borderColor: '#ff6600',
  },
};

const TeamDashboard = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    lunchValid: 0,
    dinnerValid: 0,
    snacksValid: 0,
  });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const res = await axios.get(`${API_URL}/api/teams`, config);
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setTeams(data);

        const validTeams = data.filter(team => team.status === 'valid').length;
        setStats({
          total: data.length,
          valid: validTeams,
          invalid: data.length - validTeams,
          lunchValid: 0,
          dinnerValid: 0,
          snacksValid: 0,
        });
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [navigate]);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.leader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowMore = (team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  };

  const getStatusChipColor = (status) => {
    return status === 'valid' ? '#4caf50' : '#ff6600';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#fff',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            mb: 4,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff6600, #ff8533)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          Team Dashboard
        </Typography>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {[
            { label: 'Total Teams', value: stats.total },
            { label: 'Valid Teams', value: stats.valid, color: '#4caf50' },
            { label: 'Invalid Teams', value: stats.invalid, color: '#ff6600' }
          ].map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={statCardSx}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: stat.color || '#ff6600', fontWeight: 600 }}>{stat.label}</Typography>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={searchBoxSx}>
          <Search sx={{ color: '#ff6600', fontSize: 28 }} />
          <Input
            fullWidth
            disableUnderline
            placeholder="Search teams by name or leader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={inputSx}
          />
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#ff6600' }} />
          </Box>
        ) : (teams.length === 0 ? (
            <Typography variant="h6" textAlign="center" color="rgba(255,255,255,0.7)">No teams found.</Typography>
        ) : (
          <Grid container spacing={4}>
            {(searchQuery ? filteredTeams : teams).map((team) => (
              <Grid item xs={12} md={6} key={team._id}>
                <Card sx={teamCardSx}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, color: '#ff6600', fontWeight: 600 }}>{team.name}</Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                      Leader: {team.leader}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                      <Chip label={`Status: ${team.status.charAt(0).toUpperCase() + team.status.slice(1)}`} size="small" sx={{ bgcolor: getStatusChipColor(team.status), color: '#fff', fontWeight: 600 }} />
                      <Chip label={`Members: ${team.members.length}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                      <Chip label={`Lunch: ${team.foodStatus?.lunch || '-'}`} size="small" sx={{ bgcolor: team.foodStatus?.lunch === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                      <Chip label={`Dinner: ${team.foodStatus?.dinner || '-'}`} size="small" sx={{ bgcolor: team.foodStatus?.dinner === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                      <Chip label={`Snacks: ${team.foodStatus?.snacks || '-'}`} size="small" sx={{ bgcolor: team.foodStatus?.snacks === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                    </Stack>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2, color: '#ff6600', borderColor: '#ff6600', fontWeight: 600, '&:hover': { borderColor: '#ff8533', color: '#ff8533' } }}
                      onClick={() => handleShowMore(team)}
                    >
                      Show More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      </Container>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'rgba(30,30,30,0.97)',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          minWidth: 340,
          maxWidth: 420,
          outline: 'none',
          color: '#fff',
        }}>
          {selectedTeam && (
            <>
              <Typography variant="h5" sx={{ color: '#ff6600', fontWeight: 700, mb: 2 }}>{selectedTeam.name}</Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Leader: <b>{selectedTeam.leader}</b></Typography>
              <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 1 }}>Members:</Typography>
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
              <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 1 }}>
                Status: <Chip label={selectedTeam.status.charAt(0).toUpperCase() + selectedTeam.status.slice(1)} size="small" sx={{ bgcolor: getStatusChipColor(selectedTeam.status), color: '#fff', fontWeight: 700 }} />
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={`Lunch: ${selectedTeam.foodStatus?.lunch || '-'}`} size="small" sx={{ bgcolor: selectedTeam.foodStatus?.lunch === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                <Chip label={`Dinner: ${selectedTeam.foodStatus?.dinner || '-'}`} size="small" sx={{ bgcolor: selectedTeam.foodStatus?.dinner === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
                <Chip label={`Snacks: ${selectedTeam.foodStatus?.snacks || '-'}`} size="small" sx={{ bgcolor: selectedTeam.foodStatus?.snacks === 'valid' ? '#4caf50' : '#ff6600', color: '#fff', fontWeight: 600 }} />
              </Stack>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                {selectedTeam.qrData && (
                  <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                    <QRCode
                      value={selectedTeam.qrData}
                      size={200}
                      level="H"
                      includeMargin={true}
                      renderAs="svg"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </Box>
                )}
              </Box>
              <Button onClick={handleCloseModal} sx={{ mt: 3, color: '#ff6600', borderColor: '#ff6600', fontWeight: 600 }} variant="outlined" fullWidth>Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TeamDashboard;
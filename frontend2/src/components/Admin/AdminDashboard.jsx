import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Tooltip,
  IconButton,
  Divider,
  LinearProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PeopleIcon from '@mui/icons-material/People';
import QrCodeScannerIcon from '@mui/icons-material/CropFree';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Custom styled components
const GradientTypography = ({ children, ...props }) => (
  <Typography
    {...props}
    sx={{
      background: 'linear-gradient(45deg, #ff6600, #ff8533)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      ...props.sx
    }}
  >
    {children}
  </Typography>
);

const StatCard = ({ title, value, icon, color, loading, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Zoom in={true} style={{ transitionDelay: props.delay }}>
      <Card
        sx={{
          background: 'rgba(30, 30, 30, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: theme.shadows[3],
          backdropFilter: 'blur(10px)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[8],
            '& .hover-effect': {
              opacity: 1,
            },
          },
          ...props.sx
        }}
      >
        <Box
          className="hover-effect"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, transparent)`,
            opacity: 0.7,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
        <CardContent sx={{ p: isMobile ? 2 : 3, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: '12px',
                bgcolor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              {React.cloneElement(icon, { sx: { color, fontSize: isMobile ? '1.5rem' : '2rem' } })}
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              {title}
            </Typography>
          </Box>
          {loading ? (
            <LinearProgress sx={{ my: 2 }} />
          ) : (
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color,
                fontSize: isMobile ? '2rem' : '2.5rem',
                mb: 1
              }}
            >
              {value}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
};

const FoodStatCard = ({ meal, stats, loading, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const percentage = stats.total ? Math.round((stats.valid / stats.total) * 100) : 0;

  return (
    <Zoom in={true} style={{ transitionDelay: props.delay }}>
      <Card
        sx={{
          background: 'rgba(30, 30, 30, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: theme.shadows[3],
          backdropFilter: 'blur(10px)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[8],
          },
          ...props.sx
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <RestaurantIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                textTransform: 'capitalize'
              }}
            >
              {meal}
            </Typography>
          </Box>
          {loading ? (
            <LinearProgress sx={{ my: 2 }} />
          ) : (
            <>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.secondary.main,
                    mb: 1
                  }}
                >
                  {stats.valid} / {stats.total}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Valid / Total
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: percentage > 50 ? '#4caf50' : '#ff9800',
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'right'
                  }}
                >
                  {percentage}%
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
};

const ActionCard = ({ title, description, icon, link, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Zoom in={true} style={{ transitionDelay: props.delay }}>
      <Card
        sx={{
          background: 'rgba(30, 30, 30, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: theme.shadows[3],
          backdropFilter: 'blur(10px)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[8],
            '& .action-button': {
              color: theme.palette.primary.main,
              '& .arrow-icon': {
                transform: 'translateX(4px)',
              },
            },
          },
          ...props.sx
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3, flexGrow: 1 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: `${theme.palette.primary.main}15`,
              display: 'inline-flex',
              mb: 2
            }}
          >
            {React.cloneElement(icon, {
              sx: { color: theme.palette.primary.main, fontSize: isMobile ? '2rem' : '2.5rem' }
            })}
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 600,
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 2
            }}
          >
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: isMobile ? 2 : 3, pt: 0 }}>
          <Button
            component={Link}
            to={link}
            className="action-button"
            endIcon={<ArrowForwardIcon className="arrow-icon" sx={{ transition: 'transform 0.2s' }} />}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                background: 'none',
              },
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Zoom>
  );
};

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTeams: 0,
    validTeams: 0,
    invalidTeams: 0,
    totalParticipants: 0,
    foodStats: {
      lunch: { total: 0, valid: 0 },
      dinner: { total: 0, valid: 0 },
      snacks: { total: 0, valid: 0 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [foodStats, setFoodStats] = useState({
    breakfast: { total: 0, served: 0 },
    lunch: { total: 0, served: 0 },
    dinner: { total: 0, served: 0 },
    snacks: { total: 0, served: 0 }
  });

  // Base styles for dark, semi-transparent elements
  const darkCardStyle = {
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: theme.shadows[3],
    color: '#fff',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[6],
    },
  };

   const darkPaperStyle = {
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: theme.shadows[3],
    backdropFilter: 'blur(10px)',
    p: 3,
    mt: 4,
    color: '#fff'
  };

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch teams data
        const teamsRes = await axios.get(`${API_URL}/api/teams`, config);
        const teams = teamsRes.data.data;

        // Calculate stats from teams data
        const newStats = {
          totalTeams: teams.length,
          validTeams: teams.filter(team => team.status === 'valid').length,
          invalidTeams: teams.filter(team => team.status === 'invalid').length,
          totalParticipants: teams.reduce((sum, team) => sum + (team.members?.length || 0), 0),
          foodStats: {
            lunch: {
              total: teams.length,
              valid: teams.filter(team => team.foodStatus?.lunch === 'valid').length
            },
            dinner: {
              total: teams.length,
              valid: teams.filter(team => team.foodStatus?.dinner === 'valid').length
            },
            snacks: {
              total: teams.length,
              valid: teams.filter(team => team.foodStatus?.snacks === 'valid').length
            }
          }
        };

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFoodStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const res = await axios.get(`${API_URL}/api/admin/food-stats`, config);
         if (res.data && typeof res.data === 'object') {
             setFoodStats(res.data);
         } else {
             console.warn('Unexpected food stats response format:', res.data);
         }

      } catch (error) {
        console.error('Error fetching food stats:', error);
      }
    };

    fetchStats();
    fetchFoodStats();
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ marginTop: '20px', color: '#fff' }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#fff',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 0 }
      }}
    >
      <Container maxWidth="lg">
        <Fade in={true}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <GradientTypography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 'bold',
                mb: 2,
                letterSpacing: 1,
              }}
            >
              Admin Dashboard
            </GradientTypography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Monitor team registrations, food status, and manage the event efficiently
            </Typography>
          </Box>
        </Fade>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Teams"
              value={stats.totalTeams}
              icon={<PeopleIcon />}
              color={theme.palette.primary.main}
              loading={loading}
              delay="100ms"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Valid Teams"
              value={stats.validTeams}
              icon={<DashboardIcon />}
              color="#4caf50"
              loading={loading}
              delay="200ms"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Invalid Teams"
              value={stats.invalidTeams}
              icon={<DashboardIcon />}
              color="#f44336"
              loading={loading}
              delay="300ms"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Participants"
              value={stats.totalParticipants}
              icon={<PersonAddIcon />}
              color={theme.palette.secondary.main}
              loading={loading}
              delay="400ms"
            />
          </Grid>
        </Grid>

        {/* Food Status Overview */}
        <Fade in={true}>
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <GradientTypography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{ flexGrow: 1 }}
              >
                Food Status Overview
              </GradientTypography>
              <Tooltip title="Refresh data">
                <IconButton
                  onClick={() => fetchStats()}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              {['lunch', 'dinner', 'snacks'].map((meal, index) => (
                <Grid item xs={12} md={4} key={meal}>
                  <FoodStatCard
                    meal={meal}
                    stats={stats.foodStats[meal]}
                    loading={loading}
                    delay={`${(index + 1) * 100}ms`}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Admin Actions */}
        <Fade in={true}>
          <Box>
            <GradientTypography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{ mb: 3 }}
            >
              Quick Actions
            </GradientTypography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ActionCard
                  title="Manage Teams"
                  description="View all registered teams, approve team registrations, and manage team details."
                  icon={<PeopleIcon />}
                  link="/admin/teams"
                  delay="100ms"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ActionCard
                  title="QR Scanner"
                  description="Scan team QR codes for check-in and registration at the event."
                  icon={<QrCodeScannerIcon />}
                  link="/admin/scanner"
                  delay="200ms"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ActionCard
                  title="User Management"
                  description="Create and manage admin and volunteer accounts."
                  icon={<PersonAddIcon />}
                  link="/admin/users"
                  delay="300ms"
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
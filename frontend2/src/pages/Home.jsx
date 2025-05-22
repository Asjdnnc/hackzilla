import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Link as MuiLink
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import image from "../../public/image.png"
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TimerIcon from '@mui/icons-material/Timer';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#ffffff',
  },
  hero: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(255, 102, 0, 0.1) 0%, transparent 70%)',
      zIndex: 0,
    },
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    padding: '64px 0',
  },
  heroTitle: {
    fontWeight: 700,
    background: 'linear-gradient(45deg, #ff6600, #ff8533)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    animation: '$fadeInUp 0.8s ease-out',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '32px',
    animation: '$fadeInUp 0.8s ease-out 0.2s both',
  },
  heroButtons: {
    marginTop: '32px',
    animation: '$fadeInUp 0.8s ease-out 0.4s both',
  },
  featureSection: {
    padding: '64px 0',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
    position: 'relative',
    marginTop: '80px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(255, 102, 0, 0.05) 0%, transparent 70%)',
      zIndex: 0,
    },
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: '48px',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '2rem',
    animation: '$fadeInUp 0.8s ease-out',
  },
  roleSection: {
    marginBottom: '64px',
  },
  roleTitle: {
    color: '#ff6600',
    marginBottom: '32px',
    fontWeight: 600,
    fontSize: '1.5rem',
    animation: '$fadeInUp 0.8s ease-out 0.2s both',
  },
  featureCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '32px 24px 24px 24px',
    background: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
    animation: '$fadeInUp 0.5s ease-out',
    boxSizing: 'border-box',
    '@media (max-width: 600px)': {
      padding: '20px',
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 102, 0, 0.08) 0%, transparent 100%)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
    },
  },
  featureCardContent: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'rgba(40,40,40,0.85)',
    color: '#ff6600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    '&.admin': {
      background: 'rgba(255, 102, 0, 0.18)',
      color: '#ff6600',
    },
    '&.volunteer': {
      background: 'rgba(76, 175, 80, 0.18)',
      color: '#4caf50',
    },
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '16px',
    color: '#ff6600',
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 600px)': {
      fontSize: '2rem',
    },
  },
  featureTitle: {
    fontWeight: 600,
    marginBottom: '10px',
    color: '#ff6600',
    position: 'relative',
    zIndex: 1,
    fontSize: '1.25rem',
    '@media (max-width: 600px)': {
      fontSize: '1.1rem',
    },
  },
  featureContent: {
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: '0',
    position: 'relative',
    zIndex: 1,
    lineHeight: 1.6,
    fontSize: '1rem',
    '@media (max-width: 600px)': {
      fontSize: '0.95rem',
    },
  },
  footer: {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '64px 0 32px',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 102, 0, 0.3), transparent)',
    },
  },
  footerGrid: {
    marginBottom: '48px',
  },
  footerTitle: {
    color: '#ffffff',
    fontWeight: 600,
    marginBottom: '24px',
    fontSize: '1.2rem',
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#ff6600',
      transform: 'translateX(4px)',
    },
  },
  footerContact: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '16px',
    '& svg': {
      marginRight: '12px',
      color: '#ff6600',
    },
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '24px',
    textAlign: 'center',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
    '& .MuiIconButton-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: '#ff6600',
        transform: 'translateY(-4px)',
      },
    },
  },
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes fadeInScale': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  heroImage: {
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    animation: '$fadeInScale 0.8s ease-out 0.4s both',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
    },
    '@media (max-width: 600px)': {
      maxWidth: '300px',
    },
  },
  countdownContainer: {
    background: 'rgba(30, 30, 30, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '24px',
    marginTop: '28px',
    width: '100%',
    maxWidth: '800px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  countdownTitle: {
    color: '#ff6600',
    fontWeight: 600,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.5rem',
  },
  timerDisplay: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
  },
  timeUnit: {
    background: 'rgba(255, 102, 0, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    minWidth: '140px',
    textAlign: 'center',
  },
  timeValue: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#ff6600',
    lineHeight: 1,
  },
  timeLabel: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '8px',
  },
});

const Home = () => {
  const classes = useStyles();
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set hackathon start time (adjust this to your hackathon's start time)
  const hackathonStart = new Date('2024-05-28T12:00:00'); // Updated to May 28, 12 noon
  const hackathonEnd = new Date(hackathonStart.getTime() + 24 * 60 * 60 * 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = hackathonEnd - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/api/ping`).catch(() => {});
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const adminFeatures = [
    {
      icon: <GroupsIcon className={classes.featureIcon} />,
      title: 'Team Management',
      content: 'Register teams, manage team details, and perform CRUD operations on team information.',
      role: 'admin',
    },
    {
      icon: <QrCodeScannerIcon className={classes.featureIcon} />,
      title: 'QR Code Scanner',
      content: 'Scan team QR codes to manage check-ins and update food status for all meals.',
      role: 'admin',
    },
    {
      icon: <AdminPanelSettingsIcon className={classes.featureIcon} />,
      title: 'Admin Dashboard',
      content: 'Access comprehensive event statistics, manage volunteers, and oversee all operations.',
      role: 'admin',
    },
  ];

  const volunteerFeatures = [
    {
      icon: <QrCodeScannerIcon className={classes.featureIcon} />,
      title: 'Mobile QR Scanner',
      content: 'Quickly scan team QR codes using your mobile device to update food status.',
      role: 'volunteer',
    },
    {
      icon: <RestaurantIcon className={classes.featureIcon} />,
      title: 'Food Status Management',
      content: 'Easily toggle food status (breakfast, lunch, dinner, snacks) for teams.',
      role: 'volunteer',
    },
    {
      icon: <SecurityIcon className={classes.featureIcon} />,
      title: 'Secure Access',
      content: 'Limited access to food management features with secure authentication.',
      role: 'volunteer',
    },
  ];

  return (
    <div className={classes.root}>
      <Box sx={{ mt: '0px' }}>
        <Box className={classes.hero}>
          <Container maxWidth="lg" className={classes.heroContent}>
            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h1" className={classes.heroTitle} gutterBottom>
                    Welcome to Hackzilla
                  </Typography>
                  <Typography variant="h5" className={classes.heroSubtitle}>
                    The ultimate hackathon management platform. Register your team, get your QR code, and check in seamlessly at the event.
                  </Typography>
                  <Stack 
                    direction={isMobile ? "column" : "row"} 
                    spacing={2} 
                    className={classes.heroButtons}
                  >
                    {!user ? (
                      <>
                        <Button 
                          component={Link} 
                          to="/register" 
                          variant="contained" 
                          className={`${classes.ctaButton} primary`}
                          endIcon={<ArrowForwardIcon />}
                        >
                          Get Started
                        </Button>
                        <Button 
                          component={Link} 
                          to="/login" 
                          variant="outlined" 
                          sx={{ 
                            color: 'white', 
                            borderColor: 'white',
                            '&:hover': {
                              borderColor: '#ff6600',
                              color: '#ff6600',
                            }
                          }}
                        >
                          Login
                        </Button>
                      </>
                    ) : user.isAdmin ? (
                      <Button 
                        component={Link} 
                        to="/admin" 
                        variant="contained" 
                        className={`${classes.ctaButton} primary`}
                        endIcon={<ArrowForwardIcon />}
                      >
                        Admin Dashboard
                      </Button>
                    ) : user.role === 'volunteer' ? (
                      <Button 
                        component={Link} 
                        to="/admin/scanner"
                        variant="contained" 
                        className={`${classes.ctaButton} primary`}
                        startIcon={<QrCodeScannerIcon />}
                      >
                        Scan QR Code
                      </Button>
                    ) : (
                      <Button 
                        component={Link} 
                        to="/team-dashboard" 
                        variant="contained" 
                        className={`${classes.ctaButton} primary`}
                        endIcon={<ArrowForwardIcon />}
                      >
                        Team Dashboard
                      </Button>
                    )}
                    {user && (user.isAdmin || user.role === 'volunteer') && (
                      <Button 
                        component={Link} 
                        to="/admin/scanner"
                        variant="outlined"
                        sx={{ 
                          color: 'white', 
                          borderColor: 'white',
                          '&:hover': {
                            borderColor: '#ff6600',
                            color: '#ff6600',
                          }
                        }}
                        startIcon={<QrCodeScannerIcon />}
                      >
                        Scan QR Code
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(255, 102, 0, 0.1) 0%, transparent 70%)',
                    zIndex: 0,
                  }
                }}>
                  <img 
                    src={image} 
                    alt="Hackathon Management" 
                    className={classes.heroImage}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                  
                  {/* Add Countdown Timer */}
                  <Box className={classes.countdownContainer}>
                    <Typography variant="h5" className={classes.countdownTitle}>
                      <TimerIcon /> Time Remaining
                    </Typography>
                    <Box className={classes.timerDisplay}>
                      <Box className={classes.timeUnit}>
                        <Typography className={classes.timeValue}>
                          {String(timeLeft.hours).padStart(2, '0')}
                        </Typography>
                        <Typography className={classes.timeLabel}>Hours</Typography>
                      </Box>
                      <Box className={classes.timeUnit}>
                        <Typography className={classes.timeValue}>
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </Typography>
                        <Typography className={classes.timeLabel}>Minutes</Typography>
                      </Box>
                      <Box className={classes.timeUnit}>
                        <Typography className={classes.timeValue}>
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </Typography>
                        <Typography className={classes.timeLabel}>Seconds</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box className={classes.featureSection}>
          <Container maxWidth="lg">
            <Typography variant="h2" className={classes.sectionTitle}>
              Event Management Features
            </Typography>

            <Box className={classes.roleSection}>
              <Typography variant="h3" className={classes.roleTitle}>
                Admin Features
              </Typography>
              <Grid container spacing={3}>
                {adminFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      className={classes.featureCard}
                      style={{ background: 'rgba(30, 30, 30, 0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <span 
                        className={`${classes.badge} ${feature.role}`} 
                        style={feature.role === 'admin' 
                          ? { background: 'rgba(255, 102, 0, 0.18)', color: '#ff6600' } 
                          : { background: 'rgba(76, 175, 80, 0.18)', color: '#4caf50' }}
                      >
                        {feature.role === 'admin' ? 'ADMIN' : 'VOLUNTEER'}
                      </span>
                      <CardContent className={classes.featureCardContent}>
                        {feature.icon}
                        <Typography variant="h5" className={classes.featureTitle} style={{ color: '#ff6600' }}>
                          {feature.title}
                        </Typography>
                        <Typography className={classes.featureContent} style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {feature.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box className={classes.roleSection}>
              <Typography variant="h3" className={classes.roleTitle}>
                Volunteer Features
              </Typography>
              <Grid container spacing={3}>
                {volunteerFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      className={classes.featureCard}
                      style={{ background: 'rgba(30, 30, 30, 0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <span 
                        className={`${classes.badge} ${feature.role}`} 
                        style={feature.role === 'admin' 
                          ? { background: 'rgba(255, 102, 0, 0.18)', color: '#ff6600' } 
                          : { background: 'rgba(76, 175, 80, 0.18)', color: '#4caf50' }}
                      >
                        {feature.role === 'admin' ? 'ADMIN' : 'VOLUNTEER'}
                      </span>
                      <CardContent className={classes.featureCardContent}>
                        {feature.icon}
                        <Typography variant="h5" className={classes.featureTitle} style={{ color: '#ff6600' }}>
                          {feature.title}
                        </Typography>
                        <Typography className={classes.featureContent} style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {feature.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </Box>

        <Box className={classes.footer}>
          <Container maxWidth="lg">
            <Grid container spacing={4} className={classes.footerGrid}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" className={classes.footerTitle}>
                  About Hackzilla
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  The ultimate hackathon management platform for seamless event organization, team management, and participant tracking.
                </Typography>
                <Box className={classes.footerContact}>
                  <EmailIcon />
                  <Typography>contact@hackzilla.com</Typography>
                </Box>
                <Box className={classes.footerContact}>
                  <PhoneIcon />
                  <Typography>+1 (555) 123-4567</Typography>
                </Box>
                <Box className={classes.footerContact}>
                  <LocationOnIcon />
                  <Typography>123 Hack Street, Tech City, TC 12345</Typography>
                </Box>
              </Grid>
              </Grid>
          </Container>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
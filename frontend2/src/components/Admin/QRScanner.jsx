import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Snackbar, 
  Box, 
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';

// Define glassmorphic styles (similar to CreateTeam)
const glassPaperSx = {
  background: 'rgba(30, 30, 30, 0.85)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 2,
  color: '#fff',
  backdropFilter: 'blur(10px)',
  p: { xs: 1.5, sm: 3 }, // Responsive padding
  mt: 4 // Add margin top
};

const API_URL = import.meta.env.VITE_API_URL;

// Define the list of actions and their corresponding tab labels
const scanActions = ['check-in', 'lunch', 'dinner', 'snacks'];

const QRScanner = () => {
  const theme = useTheme(); // Use theme
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [scanning, setScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(scanActions[0]); // Default action to the first tab
  const [scannedTeam, setScannedTeam] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0); // State for active tab

  useEffect(() => {
    // Initialize scanner
    const qrCodeScanner = new Html5Qrcode("reader");
    setHtml5QrCode(qrCodeScanner);

    // Cleanup on unmount
    return () => {
      if (qrCodeScanner) {
        try {
          const stopPromise = qrCodeScanner.stop();
          if (stopPromise && typeof stopPromise.then === 'function') {
            stopPromise.catch(err => {
              const msg = typeof err === 'string' ? err : (err && err.message ? err.message : '');
              if (msg.includes('Cannot stop, scanner is not running or paused')) {
                // Ignore this error
              } else {
                console.error(err);
              }
            });
          }
        } catch (err) {
          const msg = typeof err === 'string' ? err : (err && err.message ? err.message : '');
          if (msg.includes('Cannot stop, scanner is not running or paused')) {
            // Ignore this error
          } else {
            console.error(err);
          }
        }
      }
    };
  }, []);

  // Stop scanner when tab changes or when a scan result is displayed
  useEffect(() => {
    if (scanning && (action !== scanActions[selectedTabIndex] || scannedTeam)) {
       stopScanner();
    }
  }, [selectedTabIndex, action, scannedTeam, scanning]);

  const startScanner = () => {
    if (!html5QrCode) return;

    // Ensure previous scan result is cleared
    setScannedTeam(null);
    
    const config = { fps: 10, qrbox: isMobile ? 180 : 250 };
    
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    )
    .then(() => {
      setScanning(true);
      // Update action state based on selected tab
      setAction(scanActions[selectedTabIndex]);
    })
    .catch(err => {
      console.error("Error starting scanner:", err);
      showMessage("Failed to start scanner. Please check camera permissions.", "error");
    });
  };

  const stopScanner = () => {
    if (html5QrCode && scanning) {
      try {
        const stopPromise = html5QrCode.stop();
        if (stopPromise && typeof stopPromise.then === 'function') {
          stopPromise
            .then(() => {
              setScanning(false);
            })
            .catch(err => {
              const msg = typeof err === 'string' ? err : (err && err.message ? err.message : '');
              if (msg.includes('Cannot stop, scanner is not running or paused')) {
                // Ignore this error
              } else {
                console.error(err);
              }
              setScanning(false);
            });
        }
      } catch (err) {
        const msg = typeof err === 'string' ? err : (err && err.message ? err.message : '');
        if (msg.includes('Cannot stop, scanner is not running or paused')) {
          // Ignore this error
        } else {
          console.error(err);
        }
        setScanning(false);
      }
    }
  };

  const onScanSuccess = async (decodedText) => {
    // Stop scanner after successful scan
    stopScanner();
    
    try {
      // Parse QR data (assuming decodedText is the qrData)
      const qrData = decodedText;
      
      // Send to backend
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      
      // Use the current action derived from the selected tab
      const currentAction = scanActions[selectedTabIndex];

      const response = await axios.post(`${API_URL}/api/teams/scan`, { qrData, action: currentAction }, config);
      
      setScannedTeam(response.data.data);
      
      let successMessage = '';
      if (currentAction === 'check-in') {
        successMessage = `Team "${response.data.data.name}" checked in successfully!`;
      } else {
        successMessage = `${currentAction.charAt(0).toUpperCase() + currentAction.slice(1)} status updated for team "${response.data.data.name}"!`;
      }
      
      showMessage(successMessage, "success");
    } catch (error) {
      console.error("Error processing QR code:", error);
      showMessage(error.response?.data?.message || "Invalid QR code or server error", "error");
    }
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently - no need to show errors during normal scanning
    // console.log("QR code scanning failure:", error); // Keep this for debugging if needed
  };

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
    // Stop scanning when tab changes
    stopScanner();
     // Clear any previous scan result when tab changes
    setScannedTeam(null);
  };

  const resetScan = () => {
    setScannedTeam(null);
    // Optionally restart scanner after reset if desired, or let user click start
    // startScanner(); 
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)', // Adjust based on header height
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', // Dark background
      color: '#fff', // White text
      py: isMobile ? 1 : 4,
    }}>
      <Container maxWidth={isMobile ? 'sm' : 'md'}>
        <Paper elevation={3} sx={glassPaperSx}> {/* Apply glassmorphic style */}
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom align="center" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #ff6600, #ff8533)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: isMobile ? 2 : 3
          }}>
            QR Code Scanner
          </Typography>
          
          {/* Tabs for actions */}
          <Box sx={{ width: '100%', mb: isMobile ? 2 : 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={selectedTabIndex} 
              onChange={handleTabChange} 
              aria-label="scan action tabs"
              centered={!isMobile}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              allowScrollButtonsMobile
              indicatorColor="primary"
              textColor="primary"
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: theme.palette.primary.main },
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)', minWidth: isMobile ? 90 : 120, fontSize: isMobile ? '0.9rem' : '1rem' },
                '& .Mui-selected': { color: theme.palette.primary.main, fontWeight: 700 },
              }}
            >
              {scanActions.map((action, index) => (
                <Tab label={action.replace('-', ' ').toUpperCase()} key={action} />
              ))}
            </Tabs>
          </Box>

          {/* Content based on selected tab or scan result */}
          {!scannedTeam ? (
            <>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div id="reader" style={{ width: isMobile ? 220 : 320, height: isMobile ? 220 : 320, maxWidth: '100%', margin: '0 auto', border: '1px solid #ff6600', borderRadius: '8px', overflow: 'hidden', background: '#181818' }}></div> {/* Add styling to reader */}
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
                {!scanning ? (
                  <Button 
                    variant="contained" 
                    color="primary" // Use primary color from theme
                    onClick={startScanner}
                    sx={{
                       background: 'linear-gradient(45deg, #ff6600, #ff8533)', // Gradient background
                       color: '#fff',
                       fontWeight: 700,
                       width: isMobile ? '100%' : 'auto',
                       fontSize: isMobile ? '1rem' : '1.1rem',
                       py: isMobile ? 1.2 : 1.5,
                       borderRadius: 2
                    }}
                  >
                    Start Scanner
                  </Button>
                ) : (
                  <Button 
                    variant="outlined" // Use outlined for stop
                    color="secondary" // Use secondary color from theme
                    onClick={stopScanner}
                     sx={{
                       color: theme.palette.secondary.main,
                       borderColor: theme.palette.secondary.main,
                        fontWeight: 700,
                       width: isMobile ? '100%' : 'auto',
                       fontSize: isMobile ? '1rem' : '1.1rem',
                       py: isMobile ? 1.2 : 1.5,
                       borderRadius: 2
                    }}
                  >
                    Stop Scanner
                  </Button>
                )}
              </Box>
               <Typography variant="body2" sx={{ mt: isMobile ? 2 : 3, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>
                Point the camera at a team's QR code to {scanActions[selectedTabIndex].replace('-', ' ')}.
              </Typography>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', color: '#fff' }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                Scan Result
              </Typography>
              
              <Paper sx={{ my: isMobile ? 2 : 3, p: isMobile ? 2 : 3, background: 'rgba(40,40,40,0.7)', borderRadius: 2, border: '1px solid #ff6600' }}> {/* Styled Paper for result */}
                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.secondary.main, fontWeight: 600 }}>{scannedTeam.name}</Typography>
                <Typography variant="body1" sx={{ mb: 1, color: 'rgba(255,255,255,0.8)' }}>Team ID: {scannedTeam.teamId}</Typography>
                 <Typography variant="body1" sx={{ mb: 1, color: 'rgba(255,255,255,0.8)' }}>Status: {scannedTeam.status}</Typography>
                 <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>College: {scannedTeam.collegeName}</Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}> {/* Styled Box for food status */}
                  <Typography variant="subtitle1" sx={{ color: theme.palette.primary.light, fontWeight: 600, mb: 1 }}>Food Status:</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Lunch: {scannedTeam.foodStatus?.lunch === 'valid' ? '✅ Valid' : '❌ Invalid'}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Dinner: {scannedTeam.foodStatus?.dinner === 'valid' ? '✅ Valid' : '❌ Invalid'}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Snacks: {scannedTeam.foodStatus?.snacks === 'valid' ? '✅ Valid' : '❌ Invalid'}</Typography>
                </Box>
              </Paper>
              
              <Button 
                variant="contained" 
                color="primary" 
                onClick={resetScan}
                 sx={{
                       background: 'linear-gradient(45deg, #ff6600, #ff8533)', // Gradient background
                       color: '#fff',
                       fontWeight: 700,
                       mt: 2,
                       '&:hover': { background: 'linear-gradient(45deg, #ff8533, #ff6600)' },
                    }}
              >
                Scan Another Team
              </Button>
            </Box>
          )}
          
        </Paper>
      </Container>
      
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QRScanner;
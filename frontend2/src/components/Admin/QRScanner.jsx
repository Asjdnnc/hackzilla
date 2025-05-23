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
const scanActions = ['check-in', 'lunch', 'dinner', 'snacks', 'allotment'];

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
  const [transitioning, setTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false); // New state to control result display
  const [isProcessingScan, setIsProcessingScan] = useState(false); // New state to prevent duplicate processing
  const [scannedText, setScannedText] = useState(null); // New state to hold raw scanned text

  // Check URL for tab parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam !== null) {
      const tabIndex = parseInt(tabParam);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < scanActions.length) {
        setSelectedTabIndex(tabIndex);
      }
    }
  }, []);

  useEffect(() => {
    // Initialize scanner
    if (!html5QrCode) {
      const qrCodeScanner = new Html5Qrcode("reader");
      setHtml5QrCode(qrCodeScanner);
    }

    // Cleanup on unmount
    return () => {
      if (html5QrCode) {
        try {
          const stopPromise = html5QrCode.stop();
          if (stopPromise && typeof stopPromise.then === 'function') {
            stopPromise
              .then(() => {
                setScanning(false);
              })
              .catch((err) => {
                setScanning(false);
              })
              .finally(() => {
                setTransitioning(false);
              });
          } else {
            setScanning(false);
            setTransitioning(false);
            return Promise.resolve();
          }
        } catch (err) {
          setScanning(false);
          setTransitioning(false);
          return Promise.reject(err);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (scanning && showResult) {
      if (html5QrCode) {
        html5QrCode.stop().catch(err => {});
        setScanning(false);
      }
    }
  }, [scanning, showResult, html5QrCode]);

  useEffect(() => {
    const processScan = async () => {
      if (!scannedText || isProcessingScan) {
        return;
      }
      setIsProcessingScan(true);

      await stopScanner();

      try {
        const qrData = scannedText;
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        const currentAction = scanActions[selectedTabIndex];

        const actionResponse = await axios.post(`${API_URL}/api/teams/scan`, { qrData, action: currentAction }, config);

        const updatedTeamId = actionResponse.data.data?.teamId;

        if (!updatedTeamId) {
          showMessage('Scan action successful, but could not fetch updated details.', 'warning');
          setScannedTeam(actionResponse.data.data);
          setShowResult(true);
        } else {
          // Parse the QR data to get the teamId
          let teamId;
          try {
            const parsedQrData = JSON.parse(qrData);
            teamId = parsedQrData.teamId;
          } catch (error) {
            showMessage('Invalid QR code data format', 'error');
            return;
          }

          // Use the teamId from the QR data to fetch the team
          const teamResponse = await axios.get(`${API_URL}/api/teams/${teamId}`, config);

          setScannedTeam(teamResponse.data.data);
          setShowResult(true);

          if (currentAction === 'check-in') {
            showMessage(`Team "${teamResponse.data.data.name}" checked in successfully!`, "success");
          } else if (['lunch', 'dinner', 'snacks'].includes(currentAction)) {
            const mealStatus = teamResponse.data.data.foodStatus?.[currentAction] || 'invalid';
            showMessage(`${currentAction.charAt(0).toUpperCase() + currentAction.slice(1)} status set to ${mealStatus.toUpperCase()} for team "${teamResponse.data.data.name}"!`, "success");
          } else if (currentAction === 'allotment') {
            const allotmentStatus = teamResponse.data.data.allotment || 'invalid';
            showMessage(`Allotment status set to ${allotmentStatus.toUpperCase()} for team "${teamResponse.data.data.name}"!`, "success");
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
        const errorStatus = error.response?.status;

        if (errorStatus === 400) {
          // For validation errors or business logic errors
          showMessage(error.response.data.message, "warning");
          // If the scan was actually successful (like "Team already has VALID status")
          if (error.response.data.data) {
            setScannedTeam(error.response.data.data);
            setShowResult(true);
          }
        } else if (errorStatus === 404) {
          showMessage("Team not found. Please check the QR code.", "error");
        } else if (errorStatus === 401) {
          showMessage("Authentication required. Please log in again.", "error");
        } else if (errorStatus === 403) {
          // For volunteer scans, if we get a 403 but the data is there, it's actually a success
          if (error.response.data.data) {
            setScannedTeam(error.response.data.data);
            setShowResult(true);
            showMessage("Scan processed successfully!", "success");
          } else {
            showMessage("You don't have permission to perform this action.", "error");
          }
        } else {
          showMessage("An error occurred while processing the scan. Please try again.", "error");
        }
        
        // Only clear the scanned team if we didn't get valid data
        if (!error.response?.data?.data) {
          setScannedTeam(null);
          setShowResult(false);
        }
      } finally {
        setIsProcessingScan(false);
        setScannedText(null);
        
        if (html5QrCode) {
          try {
            if (scanning) {
              await html5QrCode.stop();
            }
            await html5QrCode.clear();
            setHtml5QrCode(null);
          } catch (err) {}
        }
        setScanning(false);
      }
    }
    processScan();
  }, [scannedText, isProcessingScan, html5QrCode, selectedTabIndex]);

  const getScannerSize = () => {
    if (isMobile) {
      // Use almost full width, and a large height (but not more than 90vh or 500px)
      const size = Math.min(window.innerWidth, window.innerHeight * 0.8, 500);
      return size;
    }
    return 400; // desktop
  };

  const scannerSize = getScannerSize();

  const startScanner = () => {
    if (!html5QrCode || scanning || transitioning || isProcessingScan) {
      return;
    }
    setTransitioning(true);
    setScannedTeam(null);
    setShowResult(false);
    setScannedText(null);
    
    const config = {
      fps: 30,
      qrbox: scannerSize,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true
      },
      videoConstraints: {
        facingMode: 'environment',
        width: { ideal: scannerSize },
        height: { ideal: scannerSize }
      }
    };
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    )
    .then(() => {
      setScanning(true);
      setAction(scanActions[selectedTabIndex]);
    })
    .catch(err => {
      showMessage("Failed to start scanner. Please check camera permissions.", "error");
    })
    .finally(() => setTransitioning(false));
  };

  const stopScanner = () => {
    if (!html5QrCode || !scanning || transitioning) {
      return Promise.resolve();
    }
    setTransitioning(true);

    try {
      const stopPromise = html5QrCode.stop();
      if (stopPromise && typeof stopPromise.then === 'function') {
        return stopPromise
          .then(() => {
            setScanning(false);
          })
          .catch((err) => {
            setScanning(false);
          })
          .finally(() => {
            setTransitioning(false);
          });
      } else {
        setScanning(false);
        setTransitioning(false);
        return Promise.resolve();
      }
    } catch (err) {
      setScanning(false);
      setTransitioning(false);
      return Promise.reject(err);
    }
  };

  const onScanSuccess = async (decodedText) => {
    if (!isProcessingScan) {
      setScannedText(decodedText);
    }
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently
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
    if (html5QrCode) {
      if (scanning) {
        html5QrCode.stop().catch(err => {});
      }
      html5QrCode.clear().catch(err => {});
      setHtml5QrCode(null);
    }
    setScannedTeam(null);
    setShowResult(false);
    setScanning(false);
  };

  const resetScan = async () => {
    try {
      if (html5QrCode) {
        if (scanning) {
          await html5QrCode.stop();
        }
        await html5QrCode.clear();
        setHtml5QrCode(null);
      }
      
      setScannedTeam(null);
      setShowResult(false);
      setScanning(false);
      setIsProcessingScan(false);
      setScannedText(null);
      
      const newScanner = new Html5Qrcode("reader");
      setHtml5QrCode(newScanner);
    } catch (err) {
      setScannedTeam(null);
      setShowResult(false);
      setScanning(false);
      setIsProcessingScan(false);
      setScannedText(null);
      setHtml5QrCode(null);
    }
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
          {!showResult ? ( // Render scanner if showResult is false, else render result
            <>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div
                  id="reader"
                  style={{
                    width: scannerSize,
                    height: scannerSize,
                    maxWidth: '100vw',
                    margin: 0,
                    border: '1px solid #ff6600',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#181818',
                    display: 'block',
                  }}
                ></div>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
                {!scanning ? (
                  <Button 
                    variant="contained" 
                    color="primary" // Use primary color from theme
                    onClick={startScanner}
                    disabled={transitioning}
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
                    disabled={transitioning}
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
                
                {/* Display Allotment Status in Scan Result */}
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                     <Typography variant="subtitle1" sx={{ color: theme.palette.primary.light, fontWeight: 600, mb: 1 }}>Allotment Status:</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {scannedTeam.allotment === 'valid' ? '✅ Valid' : '❌ Invalid'}
                    </Typography>
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}> {/* Styled Box for food status */}
                  <Typography variant="subtitle1" sx={{ color: theme.palette.primary.light, fontWeight: 600, mb: 1 }}>Food Status:</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Lunch: {scannedTeam.foodStatus?.lunch === 'valid' ? '✅ Valid' : '❌ Invalid'}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Dinner: {scannedTeam.foodStatus?.dinner === 'valid' ? '✅ Valid' : '❌ Invalid'}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Snacks: {scannedTeam.foodStatus?.snacks === 'valid' ? '✅ Valid' : '❌ Invalid'}</Typography>
                </Box>
              </Paper>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={resetScan}
                  sx={{
                    background: 'linear-gradient(45deg, #ff6600, #ff8533)',
                    color: '#fff',
                    fontWeight: 700,
                    '&:hover': { background: 'linear-gradient(45deg, #ff8533, #ff6600)' },
                  }}
                >
                  Scan Another Team
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => {
                    // Add the current tab index to the URL before reloading
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('tab', selectedTabIndex);
                    window.location.href = currentUrl.toString();
                  }}
                  sx={{
                    color: '#ff6600',
                    borderColor: '#ff6600',
                    fontWeight: 700,
                    '&:hover': { 
                      borderColor: '#ff8533',
                      backgroundColor: 'rgba(255, 102, 0, 0.1)'
                    },
                  }}
                >
                  Reload Scanner
                </Button>
              </Box>
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
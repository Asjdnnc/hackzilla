import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Snackbar, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box 
} from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('check-in');
  const [scannedTeam, setScannedTeam] = useState(null);

  useEffect(() => {
    // Initialize scanner
    const qrCodeScanner = new Html5Qrcode("reader");
    setHtml5QrCode(qrCodeScanner);

    // Cleanup on unmount
    return () => {
      if (qrCodeScanner && qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(err => console.error(err));
      }
    };
  }, []);

  const startScanner = () => {
    if (!html5QrCode) return;

    const config = { fps: 10, qrbox: 250 };
    
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    )
    .then(() => {
      setScanning(true);
    })
    .catch(err => {
      console.error("Error starting scanner:", err);
      showMessage("Failed to start scanner. Please check camera permissions.", "error");
    });
  };

  const stopScanner = () => {
    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode.stop()
        .then(() => {
          setScanning(false);
        })
        .catch(err => {
          console.error("Error stopping scanner:", err);
        });
    }
  };

  const onScanSuccess = async (decodedText) => {
    // Stop scanner after successful scan
    stopScanner();
    
    try {
      // Parse QR data
      const qrData = decodedText;
      
      // Send to backend
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.post('/api/teams/scan', { qrData, action }, config);
      
      setScannedTeam(response.data.data);
      
      let successMessage = '';
      if (action === 'check-in') {
        successMessage = `Team "${response.data.data.name}" checked in successfully!`;
      } else {
        successMessage = `${action.charAt(0).toUpperCase() + action.slice(1)} status updated for team "${response.data.data.name}"!`;
      }
      
      showMessage(successMessage, "success");
    } catch (error) {
      console.error("Error processing QR code:", error);
      showMessage(error.response?.data?.message || "Invalid QR code or server error", "error");
    }
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently - no need to show errors during normal scanning
    console.log("QR code scanning failure:", error);
  };

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const resetScan = () => {
    setScannedTeam(null);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom align="center">
          QR Code Scanner
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="action-select-label">Action</InputLabel>
            <Select
              labelId="action-select-label"
              id="action-select"
              value={action}
              label="Action"
              onChange={handleActionChange}
              disabled={scanning}
            >
              <MenuItem value="check-in">Check-in Team</MenuItem>
              <MenuItem value="breakfast">Toggle Breakfast Status</MenuItem>
              <MenuItem value="lunch">Toggle Lunch Status</MenuItem>
              <MenuItem value="dinner">Toggle Dinner Status</MenuItem>
              <MenuItem value="snacks">Toggle Snacks Status</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {!scannedTeam ? (
          <>
            <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              {!scanning ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={startScanner}
                >
                  Start Scanner
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={stopScanner}
                >
                  Stop Scanner
                </Button>
              )}
            </div>
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Scan Result
            </Typography>
            
            <Box sx={{ my: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Typography variant="h6">{scannedTeam.name}</Typography>
              <Typography variant="body1">Team ID: {scannedTeam.teamId}</Typography>
              <Typography variant="body1">Status: {scannedTeam.status}</Typography>
              <Typography variant="body1">College: {scannedTeam.collegeName}</Typography>
              
              <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle1">Food Status:</Typography>
                <Typography variant="body2">Breakfast: {scannedTeam.food.breakfast ? '✅' : '❌'}</Typography>
                <Typography variant="body2">Lunch: {scannedTeam.food.lunch ? '✅' : '❌'}</Typography>
                <Typography variant="body2">Dinner: {scannedTeam.food.dinner ? '✅' : '❌'}</Typography>
                <Typography variant="body2">Snacks: {scannedTeam.food.snacks ? '✅' : '❌'}</Typography>
              </Box>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={resetScan}
            >
              Scan Another
            </Button>
          </Box>
        )}
        
        <Typography variant="body1" style={{ marginTop: '20px', textAlign: 'center' }}>
          Point the camera at a team's QR code to {action === 'check-in' ? 'check them in' : 'update their food status'}.
        </Typography>
      </Paper>
      
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QRScanner;
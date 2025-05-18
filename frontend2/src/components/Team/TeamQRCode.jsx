import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeamQRCode = () => {
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Get team data for the current user
        const res = await axios.get('/api/teams/myteam', config);
        setTeam(res.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [user, navigate]);

  const downloadQRCode = () => {
    const canvas = document.getElementById('team-qrcode');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${team.teamName}-QRCode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" align="center" style={{ marginTop: '50px' }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!team) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" align="center" style={{ marginTop: '50px' }}>
          You don't have a team yet. Please create or join a team first.
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/create-team')}
          >
            Create Team
          </Button>
        </div>
      </Container>
    );
  }

  // Create QR code data
  // Update the qrData object to include all required information
  const qrData = JSON.stringify({
    teamId: team.teamId,
    teamName: team.name,
    collegeName: team.collegeName,
    members: team.members.map(member => ({
      name: member.name,
      collegeName: member.collegeName,
      isLeader: member.isLeader
    })),
    status: team.status,
    food: team.food
  });

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '30px', marginTop: '30px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Team QR Code
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          {team.teamName}
        </Typography>
        
        <div style={{ margin: '30px 0' }}>
          <QRCodeCanvas 
            id="team-qrcode"
            value={qrData}
            size={250}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <Typography variant="body1" paragraph>
          Present this QR code at the registration desk when you arrive at the hackathon.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={downloadQRCode}
        >
          Download QR Code
        </Button>
      </Paper>
    </Container>
  );
};

export default TeamQRCode;
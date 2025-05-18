import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const CardLayout = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '20px' }}>
      <Card style={{ width: '30%', margin: '10px' }}>
        <CardContent>
          <Typography variant="h5">Register Your Team</Typography>
          <Typography variant="body2">Create your team profile, add team members, and get ready for the hackathon.</Typography>
        </CardContent>
      </Card>
      <Card style={{ width: '30%', margin: '10px' }}>
        <CardContent>
          <Typography variant="h5">Get Your QR Code</Typography>
          <Typography variant="body2">Each team receives a unique QR code for quick and easy check-in at the event.</Typography>
        </CardContent>
      </Card>
      <Card style={{ width: '30%', margin: '10px' }}>
        <CardContent>
          <Typography variant="h5">Seamless Check-in</Typography>
          <Typography variant="body2">Event organizers can scan your QR code for instant check-in and registration.</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardLayout;
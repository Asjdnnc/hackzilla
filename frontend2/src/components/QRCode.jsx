import React, { forwardRef } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

const QRCodeComponent = forwardRef(({ team }, ref) => {
  if (!team) return null;

  const qrValue = JSON.stringify({
    teamId: team.id,
    teamName: team.name,
    leader: team.leader
  });

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'white' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2
      }}>
        <QRCodeSVG
          ref={ref}
          value={qrValue}
          size={200}
          level="H"
          includeMargin={true}
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Scan to verify team
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
});

export default QRCodeComponent; 
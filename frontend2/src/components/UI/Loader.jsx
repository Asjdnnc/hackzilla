import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
        minHeight: { xs: 120, sm: 200 },
        width: '100%',
        py: 4,
        background: 'none',
      }}
    >
      <CircularProgress 
        size={56}
        thickness={4.5}
        sx={{ color: 'primary.main', mb: 2, boxShadow: '0 0 16px 2px #ff6600' }}
      />
      <Typography
        variant="body1"
        sx={{
          mt: 1,
          color: 'primary.main',
          fontWeight: 600,
          letterSpacing: 1,
          animation: 'fadeIn 1.2s ease-in-out infinite alternate',
          '@keyframes fadeIn': {
            from: { opacity: 0.5 },
            to: { opacity: 1 },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
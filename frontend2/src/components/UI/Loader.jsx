import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
  text: {
    marginTop: theme.spacing(2),
  },
}));

const Loader = ({ message = 'Loading...' }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CircularProgress />
      <Typography variant="body1" className={classes.text}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
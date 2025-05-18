import React from 'react';
import { Typography, Container, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  footer: {
    padding: '24px 16px',
    marginTop: 'auto',
    backgroundColor: '#f5f5f5',
  },
}));

const Footer = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="/">
            Hackzilla
          </Link>{' '}
          {currentYear}
          {'.'}
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
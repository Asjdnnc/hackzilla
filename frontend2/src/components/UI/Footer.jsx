import React from 'react';
import { Typography, Container, Link, Box, IconButton, Divider, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(90deg, #181818 0%, #232526 100%)',
        color: '#fff',
        py: { xs: 3, sm: 4 },
        px: 2,
        boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.15)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Container maxWidth="md">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {'Copyright © '}
            <Link href="/" underline="hover" sx={{ color: '#ff6600', fontWeight: 700, fontSize: '1.1em' }}>
              Hackzilla
            </Link>{' '}
            {currentYear}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              component="a"
              href="https://github.com"
              target="_blank"
              rel="noopener"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff6600', transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}
              aria-label="GitHub"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff6600', transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}
              aria-label="Twitter"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff6600', transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
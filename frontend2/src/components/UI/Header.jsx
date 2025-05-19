import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { path: '/', text: 'Home' },
    // Add other public links here if needed
  ];

  const authLinks = [
    // User specific links (visible to all logged-in users except admin specific ones)
    { path: '/team-dashboard', text: 'Team Dashboard' },
    // Removed Create Team from here
    // Add other non-admin user links here if needed
  ];

  const adminLinks = [
    // Admin specific links (visible only to admins)
    { path: '/admin', text: 'Admin Dashboard' },
    { path: '/admin/users', text: 'User Management' },
    { path: '/admin/teams', text: 'Manage Teams' },
    { path: '/create-team', text: 'Create Team' },
    // Add other admin links here
  ];

  const commonLinks = [
    // Links visible to all logged-in users
    ...authLinks,
  ];

  // Links to display based on user authentication and role
  // Public links if no user, common links if user is not admin, common + admin links if user is admin
  const linksToDisplay = user ? (user.isAdmin ? [...commonLinks, ...adminLinks] : commonLinks) : navLinks;

  const drawerList = (links) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {links.map((link) => (
          <ListItem button key={link.path} component={NavLink} to={link.path}>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
        {user && (user.isAdmin || user.role === 'volunteer') && (
          <ListItem button component={NavLink} to="/admin/scanner">
            <ListItemText primary="Scan QR Code" />
          </ListItem>
        )}
        {user && (
           <ListItem button onClick={handleLogout}>
             <ListItemText primary="Logout" />
           </ListItem>
        )}
        {user?.isAdmin && (
          <>
            <ListItem button component={Link} to="/admin">
              <ListItemText primary="Admin Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/admin/teams">
              <ListItemText primary="Manage Teams" />
            </ListItem>
            <ListItem button component={Link} to="/admin/users">
              <ListItemText primary="User Management" />
            </ListItem>
            <ListItem button component={Link} to="/create-team">
              <ListItemText primary="Create Team" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a1a1a' }}>
      <Toolbar>
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ color: '#ff6600' }}>
            Hackzilla
          </Typography>
        </NavLink>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {linksToDisplay.map((link) => (
            <Button
              key={link.path}
              component={NavLink}
              to={link.path}
            sx={{ 
                my: 2,
              color: 'white',
                display: 'block',
                mx: 1,
                '&.active': {
                  color: '#ff6600', // Highlight color for active link
                },
              }}
            >
              {link.text}
            </Button>
          ))}
          {user && (user.isAdmin || user.role === 'volunteer') && (
            <Button
              component={NavLink}
              to="/admin/scanner"
              sx={{
                my: 2,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                mx: 1,
                 '&.active': {
                  color: '#ff6600', // Highlight color for active link
                },
              }}
              startIcon={<QrCodeScannerIcon />}
            >
              Scan QR Code
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout} sx={{ my: 2, color: 'white' }}>
              Logout ({user.username} - {user.role})
            </Button>
          ) : (
            <Button color="inherit" component={NavLink} to="/login" sx={{ my: 2, color: 'white' }}>
              Login
            </Button>
          )}
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
            size="large"
            edge="start"
                    color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
                  >
            <MenuIcon />
                  </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{ '.MuiDrawer-paper': { bgcolor: '#1a1a1a', color: '#fff' } }}
          >
            {drawerList(linksToDisplay)}
          </Drawer>
          </Box>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
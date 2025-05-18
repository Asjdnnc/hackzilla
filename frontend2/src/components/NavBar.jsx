import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hackzilla
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Typography variant="body1" color="inherit">
                Welcome, {user.name} ({user.isAdmin ? 'Admin' : 'User'})
              </Typography>
              <Button color="inherit" onClick={() => navigate("/")}>
                Home
              </Button>
              {user.isAdmin && (
                <Button color="inherit" onClick={() => navigate("/admin")}>
                  Admin Dashboard
                </Button>
              )}
              {!user.isAdmin && (
                <Button color="inherit" onClick={() => navigate("/team-dashboard")}>
                  Team Dashboard
                </Button>
              )}
              {!user.isAdmin && (
              <Button color="inherit" onClick={() => navigate("/create-team")}>
                Create Team
              </Button>
              )}
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 
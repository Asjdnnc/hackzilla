import React, { useState, useContext } from 'react';
import { Container, Typography, TextField, Button, Paper, Snackbar, Box, useTheme, useMediaQuery, InputAdornment, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Alert from '@mui/material/Alert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from "../../../public/logo.png";
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      setOpen(true);
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      navigate('/team-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#fff',
      py: theme.spacing(6),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
    <Container component="main" maxWidth="xs">
        <Paper
          sx={{
            marginTop: theme.spacing(8),
            padding: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(30, 30, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: theme.shadows[3],
            color: '#fff',
          }}
          elevation={3}
        >
          <Box sx={{ mb: theme.spacing(2) }}>
            <img src={logo} alt="Logo" style={{ maxWidth: '100px', height: 'auto' }} />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: theme.spacing(2), fontWeight: 'bold', color: theme.palette.primary.main }}>
          Welcome Back
        </Typography>
          <form
            style={{ width: '100%' }}
            onSubmit={handleSubmit}
          >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& label': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& input': {
                  color: '#fff',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
              type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& label': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& input': {
                  color: '#fff',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
              sx={{
                margin: theme.spacing(3, 0, 2),
                backgroundColor: '#ff6600',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#e65c00',
                },
              }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
          </Button>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" align="center" sx={{ color: '#ff6600', '&:hover': { textDecoration: 'underline' } }}>
                Don't have an account? Sign Up
              </Typography>
            </Link>
        </form>
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default Login;
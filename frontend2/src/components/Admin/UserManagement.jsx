import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Box,
  useTheme,
  IconButton
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = import.meta.env.VITE_API_URL;

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const darkPaperStyle = {
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: theme.shadows[3],
    backdropFilter: 'blur(10px)',
    p: 3,
    mt: 4,
    color: '#fff'
  };

  const darkTableContainerStyle = {
     backgroundColor: 'rgba(30, 30, 30, 0.7)',
     borderRadius: '12px',
     border: '1px solid rgba(255,255,255,0.05)',
     boxShadow: theme.shadows[2],
     mt: 3,
     overflow: 'hidden'
  };

  const darkTableHeadCellStyle = {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  };

   const darkTableBodyCellStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.get(`${API_URL}/api/users`, config);

      if (res.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        console.warn('API returned unexpected data format for users:', res.data);
        setUsers([]);
      }

    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('Failed to load users. Please try again.', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewUserData({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUserData({
      ...newUserData,
      [name]: value
    });
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Validate required fields
      if (!newUserData.username || !newUserData.password || !newUserData.role) {
        showMessage('Please fill in all required fields', 'error');
        return;
      }

      const response = await axios.post(`${API_URL}/api/users`, newUserData, config);
      
      if (response.data) {
        showMessage('User created successfully!', 'success');
        handleCloseDialog();
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showMessage(error.response?.data?.message || 'Failed to create user. Please try again.', 'error');
    }
  };

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenConfirmDialog = (userId) => {
    setDeleteUserId(userId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setDeleteUserId(null);
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.delete(`${API_URL}/api/users/${deleteUserId}`, config);
      showMessage('User deleted successfully!', 'success');
      handleCloseConfirmDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showMessage(error.response?.data?.message || 'Failed to delete user', 'error');
      handleCloseConfirmDialog();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#fff' }}>Loading users...</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#fff',
        py: 6,
      }}
    >
    <Container maxWidth="md">
      <Paper elevation={3} sx={darkPaperStyle}>
        <Typography variant="h4" gutterBottom sx={{
           fontWeight: 'bold',
            background: 'linear-gradient(45deg, #03dac6, #018786)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 0.5,
            mb: 3
        }}>
          User Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{ mb: 3 }}
        >
          Create User
        </Button>

        <TableContainer component={Paper} sx={darkTableContainerStyle}>
          <Table aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell sx={darkTableHeadCellStyle}>Username</TableCell>
                <TableCell sx={darkTableHeadCellStyle}>Role</TableCell>
                <TableCell sx={darkTableHeadCellStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell sx={darkTableBodyCellStyle}>{user.username}</TableCell>
                  <TableCell sx={darkTableBodyCellStyle}>{user.role}</TableCell>
                  <TableCell sx={darkTableBodyCellStyle}>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => handleOpenConfirmDialog(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} PaperProps={{ sx: darkPaperStyle }}>
        <DialogTitle sx={{ color: theme.palette.primary.main }}>Create New User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Create a new admin or volunteer account. Please provide a username and password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={newUserData.username}
            onChange={handleInputChange}
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: '#fff' } }}
            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newUserData.email}
            onChange={handleInputChange}
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: '#fff' } }}
             sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newUserData.password}
            onChange={handleInputChange}
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: '#fff' } }}
             sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } }}
          />
          <FormControl fullWidth margin="dense" sx={{ 
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }, 
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.7)' }
          }}>
            <InputLabel id="role-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={newUserData.role}
              label="Role"
              onChange={handleInputChange}
              sx={{ color: '#fff' }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="volunteer">Volunteer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
          <Button onClick={handleCreateUser} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        PaperProps={{ sx: darkPaperStyle }}
      >
        <DialogTitle sx={{ color: theme.palette.primary.main }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default UserManagement;
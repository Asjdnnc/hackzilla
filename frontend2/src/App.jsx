import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CreateTeam from './components/Team/CreateTeam';
import TeamDashboard from './components/Team/TeamDashboard';
import TeamQRCode from './components/Team/TeamQRCode';
import AdminDashboard from './components/Admin/AdminDashboard';
import QRScanner from './components/Admin/QRScanner';
import TeamList from './components/Admin/TeamList';

// Add this import
import UserManagement from './components/Admin/UserManagement';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea', // Updated to a more vibrant purple
    },
    secondary: {
      main: '#03dac6', // Updated to a modern teal
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h2: {
      fontSize: '3rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px',
          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
        },
        containedPrimary: {
          backgroundColor: '#6200ea',
          '&:hover': {
            backgroundColor: '#3700b3',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <main style={{
            minHeight: 'calc(100vh - 130px)',
            padding: { xs: '10px', sm: '20px' },
            maxWidth: '100%',
            overflowX: 'hidden'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-team" element={<CreateTeam />} />
              <Route path="/team-dashboard" element={<TeamDashboard />} />
              <Route path="/team-qrcode" element={<TeamQRCode />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/scanner" element={<QRScanner />} />
              <Route path="/admin/teams" element={<TeamList />} />
              // Add this route inside the Routes component
              <Route path="/admin/users" element={<UserManagement />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
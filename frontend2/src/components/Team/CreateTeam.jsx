import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  Checkbox,
  Tooltip,
  InputAdornment,
  Fade,
  Zoom,
  Stepper,
  Step,
  StepLabel,
  FormHelperText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import QRCode from 'qrcode.react';

const glassCardSx = {
  background: 'rgba(30, 30, 30, 0.85)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 3,
  color: '#fff',
  backdropFilter: 'blur(10px)',
};

const glassPaperSx = {
  background: 'rgba(30, 30, 30, 0.85)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 2,
  color: '#fff',
  backdropFilter: 'blur(10px)',
  p: 3,
};

const API_URL = import.meta.env.VITE_API_URL || '';

const steps = ['Team Details', 'Team Members', 'Review & Submit'];

const CreateTeam = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [leader, setLeader] = useState("");
  const [members, setMembers] = useState([{ name: "", college: "", isFromIIITS: false }]);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const qrRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const handleAddMember = () => {
    setMembers([...members, { name: "", college: "", isFromIIITS: false }]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 0:
        if (!name.trim()) errors.name = "Team name is required";
        if (!leader.trim()) errors.leader = "Team leader name is required";
        break;
      case 1:
        members.forEach((member, index) => {
          if (!member.name.trim()) errors[`member${index}Name`] = "Member name is required";
          if (!member.college.trim()) errors[`member${index}College`] = "College name is required";
        });
        break;
      default:
        break;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    const newTeam = {
      name: name.trim(),
      leader: leader.trim(),
      members: members.map(m => ({
        name: m.name.trim(),
        collegeName: m.college.trim() || "",
        isFromIIITS: !!m.isFromIIITS
      })),
      status: "invalid",
      foodStatus: {
        lunch: "invalid",
        dinner: "invalid",
        snacks: "invalid"
      }
    };

    try {
      console.log("Sending team data to backend:", newTeam);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/api/teams`, newTeam, config);

      if (response && response.data && response.data.success) {
        setRegisteredTeam(response.data.data);
        setSuccess("Team registered successfully!");
        console.log("Registered team:", response.data.data);
      } else {
        throw new Error(response?.data?.message || "Failed to register team");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during team registration");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    setName("");
    setLeader("");
    setMembers([{ name: "", college: "", isFromIIITS: false }]);
    setRegisteredTeam(null);
    setSuccess("");
  };

  const handleDownloadQR = () => {
    const qrCodeContainer = qrRef.current;
    if (qrCodeContainer) {
      const qrCodeSvg = qrCodeContainer.querySelector('svg');
      if (qrCodeSvg) {
        const svgData = new XMLSerializer().serializeToString(qrCodeSvg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngFile;
          downloadLink.download = `team_${registeredTeam?.teamId || 'qr'}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };

        img.onerror = (err) => {
          console.error("Error loading SVG for canvas:", err);
          setError("Failed to generate QR code image.");
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      } else {
        console.error("SVG element not found");
        setError("QR code SVG not found.");
      }
    } else {
      console.error("QR code container not found");
      setError("QR code container not found.");
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#ff6600', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon /> Team Information
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#ff6600' }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Tooltip 
                title="Choose a unique and memorable name for your team" 
                placement="top"
                TransitionComponent={Zoom}
              >
                <TextField
                  fullWidth
                  label="Team Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  placeholder="e.g., Code Warriors"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmojiEventsIcon sx={{ color: '#ff6600' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ style: { color: '#ff6600' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#ff6600' },
                      '&:hover fieldset': { borderColor: '#ff8533' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6600' },
                    },
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(255, 102, 0, 0.15)',
                    }
                  }}
                />
              </Tooltip>
            </Grid>

            <Grid item xs={12} md={6}>
              <Tooltip 
                title="Enter the name of your team leader" 
                placement="top"
                TransitionComponent={Zoom}
              >
                <TextField
                  fullWidth
                  label="Team Leader"
                  value={leader}
                  onChange={(e) => setLeader(e.target.value)}
                  required
                  variant="outlined"
                  error={!!formErrors.leader}
                  helperText={formErrors.leader}
                  placeholder="e.g., John Doe"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonAddIcon sx={{ color: '#ff6600' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ style: { color: '#ff6600' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#ff6600' },
                      '&:hover fieldset': { borderColor: '#ff8533' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6600' },
                    },
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(255, 102, 0, 0.15)',
                    }
                  }}
                />
              </Tooltip>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#ff6600', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon /> Team Members
                </Typography>
                <Tooltip title="Add a new team member" TransitionComponent={Zoom}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddMember}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#ff6600',
                      color: '#ff6600',
                      fontWeight: 600,
                      '&:hover': { 
                        borderColor: '#ff8533', 
                        color: '#ff8533',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(255, 102, 0, 0.15)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Add Member
                  </Button>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2, borderColor: '#ff6600' }} />
            </Grid>

            {members.map((member, index) => (
              <Grid item xs={12} key={index}>
                <Fade in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      background: 'rgba(40,40,40,0.7)', 
                      borderRadius: 2, 
                      borderColor: '#ff6600', 
                      color: '#fff', 
                      mb: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(255, 102, 0, 0.15)',
                      }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Member Name"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          required
                          variant="outlined"
                          size="small"
                          error={!!formErrors[`member${index}Name`]}
                          helperText={formErrors[`member${index}Name`]}
                          placeholder="Enter member's full name"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonAddIcon sx={{ color: '#ff6600' }} />
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{ style: { color: '#ff6600' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#fff',
                              background: 'rgba(255,255,255,0.04)',
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#ff6600' },
                              '&:hover fieldset': { borderColor: '#ff8533' },
                              '&.Mui-focused fieldset': { borderColor: '#ff6600' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="College"
                          value={member.college}
                          onChange={(e) => handleMemberChange(index, 'college', e.target.value)}
                          required
                          variant="outlined"
                          size="small"
                          error={!!formErrors[`member${index}College`]}
                          helperText={formErrors[`member${index}College`]}
                          placeholder="Enter college name"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SchoolIcon sx={{ color: '#ff6600' }} />
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{ style: { color: '#ff6600' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#fff',
                              background: 'rgba(255,255,255,0.04)',
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#ff6600' },
                              '&:hover fieldset': { borderColor: '#ff8533' },
                              '&.Mui-focused fieldset': { borderColor: '#ff6600' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Tooltip title="Is this member from IIIT Sonepat?" TransitionComponent={Zoom}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            height: '100%',
                            gap: 1
                          }}>
                            <Checkbox
                              checked={!!member.isFromIIITS}
                              onChange={e => handleMemberChange(index, 'isFromIIITS', e.target.checked)}
                              sx={{ 
                                color: '#ff6600', 
                                '&.Mui-checked': { color: '#ff6600' },
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                }
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              IIIT Sonepat
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        {members.length > 1 && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title="Remove member" TransitionComponent={Zoom}>
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveMember(index)}
                                size="small"
                                sx={{ 
                                  color: '#ff6600', 
                                  '&:hover': { 
                                    color: '#ff8533',
                                    transform: 'scale(1.1)',
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#ff6600', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon /> Review Your Team
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#ff6600' }} />
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3, background: 'rgba(40,40,40,0.7)', borderRadius: 2, borderColor: '#ff6600' }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700 }}>Team Name</Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>{name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700 }}>Team Leader</Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>{leader}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700 }}>Team Members</Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {members.map((member, idx) => (
                        <Box key={idx} sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          background: 'rgba(255,255,255,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>{member.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{member.college}</Typography>
                          {member.isFromIIITS && (
                            <Chip 
                              label="IIIT Sonepat" 
                              size="small" 
                              sx={{ 
                                bgcolor: '#ff6600', 
                                color: '#fff', 
                                fontWeight: 700,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                }
                              }} 
                            />
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #ff6600, #ff8533)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
          textAlign: 'center',
          letterSpacing: 1,
          }}
        >
          Team Registration
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              background: 'rgba(211, 47, 47, 0.1)',
              border: '1px solid rgba(211, 47, 47, 0.3)',
            }} 
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              background: 'rgba(46, 125, 50, 0.1)',
              border: '1px solid rgba(46, 125, 50, 0.3)',
            }} 
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {registeredTeam ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{
                ...glassCardSx,
                '& .MuiCardHeader-title': { color: '#fff' },
                '& .MuiCardHeader-subheader': { color: 'rgba(255,255,255,0.7)' }
              }}>
                <CardHeader 
                  title="Registration Successful" 
                  titleTypographyProps={{ variant: "h5" }}
                  sx={{ 
                    bgcolor: "rgba(255, 102, 0, 0.1)", 
                    color: "white", 
                    borderTopLeftRadius: 16, 
                    borderTopRightRadius: 16,
                    borderBottom: '1px solid rgba(255, 102, 0, 0.2)'
                  }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 0.5 }}>Team Name</Typography>
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>{registeredTeam.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 0.5 }}>Team Leader</Typography>
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>{registeredTeam.leader}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 0.5 }}>Team ID</Typography>
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>{registeredTeam.id}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 0.5 }}>Status</Typography>
                      <Chip 
                        label={registeredTeam.status} 
                        color={registeredTeam.status === "active" ? "success" : "warning"}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: registeredTeam.status === "active" ? 'rgba(46, 125, 50, 0.2)' : 'rgba(237, 108, 2, 0.2)',
                          color: registeredTeam.status === "active" ? '#4caf50' : '#ff6600',
                          border: '1px solid',
                          borderColor: registeredTeam.status === "active" ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 102, 0, 0.3)'
                        }}
                      />
                    </Box>
                    <Divider sx={{ my: 1, borderColor: 'rgba(255, 102, 0, 0.2)' }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 1 }}>Team Members</Typography>
                      <Stack spacing={1}>
                        {registeredTeam.members && registeredTeam.members.length > 0 ? (
                          registeredTeam.members.map((member, idx) => (
                            <Box key={idx} sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              p: 1, 
                              borderRadius: 1, 
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, minWidth: 90 }}>{member.name}</Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', minWidth: 90 }}>{member.collegeName || member.college}</Typography>
                              {member.isFromIIITS && (
                                <Chip 
                                  label="IIIT Sonepat" 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(255, 102, 0, 0.2)', 
                                    color: '#ff6600', 
                                    fontWeight: 700,
                                    border: '1px solid rgba(255, 102, 0, 0.3)',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                    }
                                  }} 
                                />
                              )}
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>No members listed.</Typography>
                        )}
                      </Stack>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={handleRegisterAnother}
                      startIcon={<PersonAddIcon />}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(45deg, #ff6600, #ff8533)',
                        fontWeight: 600,
                        borderRadius: 2,
                        color: '#fff',
                        '&:hover': { 
                          background: 'linear-gradient(45deg, #ff8533, #ff6600)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(255, 102, 0, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Register Another Team
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{
                ...glassCardSx,
                '& .MuiCardHeader-title': { color: '#fff' },
                '& .MuiCardHeader-subheader': { color: 'rgba(255,255,255,0.7)' }
              }} ref={qrRef}>
                <CardHeader 
                  title="Team QR Code" 
                  titleTypographyProps={{ variant: "h5" }}
                  avatar={<QrCode2Icon sx={{ color: '#ff6600' }} />}
                  sx={{ 
                    borderTopLeftRadius: 16, 
                    borderTopRightRadius: 16,
                    bgcolor: "rgba(255, 102, 0, 0.1)",
                    borderBottom: '1px solid rgba(255, 102, 0, 0.2)'
                  }}
                />
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 2,
                  bgcolor: 'rgba(255,255,255,0.02)',
                  p: 4
                }}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#fff', 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }} id="team-qr-code">
                    {registeredTeam?.teamId && (
                      <QRCode
                        value={registeredTeam.qrData}
                        size={200}
                        level="H"
                        includeMargin={true}
                        renderAs="svg"
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', mt: 1 }}>
                    Scan this QR code to verify your team registration
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleDownloadQR}
                    sx={{ 
                      color: '#ff6600', 
                      borderColor: '#ff6600', 
                      fontWeight: 600, 
                      mt: 2,
                      '&:hover': { 
                        borderColor: '#ff8533', 
                        color: '#ff8533',
                        background: 'rgba(255, 102, 0, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(255, 102, 0, 0.15)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Paper elevation={3} sx={glassPaperSx}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel 
                    sx={{
                mb: 4,
                '& .MuiStepLabel-label': { 
                        color: '#fff',
                  '&.Mui-active': { color: '#ff6600' },
                  '&.Mui-completed': { color: '#ff8533' }
                },
                '& .MuiStepIcon-root': {
                  color: 'rgba(255,255,255,0.3)',
                  '&.Mui-active': { color: '#ff6600' },
                  '&.Mui-completed': { color: '#ff8533' }
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              {renderStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                      sx={{
                        background: 'linear-gradient(45deg, #ff6600, #ff8533)',
                        fontWeight: 700,
                        borderRadius: 2,
                        minWidth: 180,
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #ff8533, #ff6600)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(255, 102, 0, 0.3)',
                      },
                      transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? 'Registering...' : 'Register Team'}
                    </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      background: 'linear-gradient(45deg, #ff6600, #ff8533)',
                      fontWeight: 700,
                      borderRadius: 2,
                      minWidth: 180,
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #ff8533, #ff6600)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(255, 102, 0, 0.3)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Next
                  </Button>
                )}
                  </Box>
            </form>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default CreateTeam;

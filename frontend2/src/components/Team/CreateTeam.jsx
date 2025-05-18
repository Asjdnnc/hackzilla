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
  Checkbox
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import QRCodeComponent from "../../components/QRCode";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form
    if (!name || name.trim() === "") {
      setError("Team name is required.");
      setLoading(false);
      return;
    }
    if (!leader || leader.trim() === "") {
      setError("Team leader name is required.");
      setLoading(false);
      return;
    }

    // Validate members after trimming
    const invalidMembers = members.some(m => 
      !m || typeof m !== 'object' || // Check if member is a valid object
      !m.name || m.name.trim() === "" || 
      !m.college || m.college.trim() === ""
    );

    if (!members || members.length === 0 || invalidMembers) {
      setError("Please ensure all team members have a name and college name.");
      setLoading(false);
      return;
    }

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
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${registeredTeam?.name || 'team'}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #ff6600, #ff8533)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
          textAlign: 'center',
          letterSpacing: 1,
        }}>
          Team Registration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert>
        )}

        {registeredTeam ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={glassCardSx}>
                <CardHeader 
                  title="Registration Successful" 
                  titleTypographyProps={{ variant: "h5" }}
                  sx={{ bgcolor: "#ff6600", color: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
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
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Divider sx={{ my: 1, borderColor: '#ff6600', opacity: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#ff8533', fontWeight: 700, mb: 1 }}>Team Members</Typography>
                      <Stack spacing={1}>
                        {registeredTeam.members && registeredTeam.members.length > 0 ? (
                          registeredTeam.members.map((member, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1, background: 'rgba(255,255,255,0.03)' }}>
                              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, minWidth: 90 }}>{member.name}</Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', minWidth: 90 }}>{member.collegeName || member.college}</Typography>
                              {member.isFromIIITS && (
                                <Chip label="IIIT Sonepat" size="small" sx={{ bgcolor: '#ff6600', color: '#fff', fontWeight: 700, ml: 1 }} />
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
                        '&:hover': { background: 'linear-gradient(45deg, #ff8533, #ff6600)' }
                      }}
                    >
                      Register Another Team
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={glassCardSx} ref={qrRef}>
                <CardHeader 
                  title="Team QR Code" 
                  titleTypographyProps={{ variant: "h5" }}
                  avatar={<QrCode2Icon sx={{ color: '#ff6600' }} />}
                  sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box>
                    {registeredTeam?.qrData && (
                      <QRCodeComponent value={registeredTeam.qrData} />
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={handleDownloadQR}
                    sx={{ color: '#ff6600', borderColor: '#ff6600', fontWeight: 600, mt: 2, '&:hover': { borderColor: '#ff8533', color: '#ff8533' } }}
                  >
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Paper elevation={3} sx={glassPaperSx}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ff6600', fontWeight: 700 }}>
                    Team Information
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: '#ff6600' }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Team Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    variant="outlined"
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
                      mb: 1
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Team Leader"
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    required
                    variant="outlined"
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
                      mb: 1
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#ff6600', fontWeight: 700 }}>Team Members</Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddMember}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#ff6600',
                        color: '#ff6600',
                        fontWeight: 600,
                        '&:hover': { borderColor: '#ff8533', color: '#ff8533' }
                      }}
                    >
                      Add Member
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2, borderColor: '#ff6600' }} />
                </Grid>

                {members.map((member, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper variant="outlined" sx={{ p: 2, background: 'rgba(40,40,40,0.7)', borderRadius: 2, borderColor: '#ff6600', color: '#fff', mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Member Name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            required
                            variant="outlined"
                            size="small"
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
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="College"
                            value={member.college}
                            onChange={(e) => handleMemberChange(index, 'college', e.target.value)}
                            required
                            variant="outlined"
                            size="small"
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
                        <Grid item xs={12} sm={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Checkbox
                              checked={!!member.isFromIIITS}
                              onChange={e => handleMemberChange(index, 'isFromIIITS', e.target.checked)}
                              sx={{ color: '#ff6600', '&.Mui-checked': { color: '#ff6600' } }}
                            />
                            <Typography variant="body2" sx={{ color: '#ff6600', ml: 1 }}>
                              IIIT Sonepat
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          {members.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveMember(index)}
                              size="small"
                              sx={{ color: '#ff6600', '&:hover': { color: '#ff8533' } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                      sx={{
                        background: 'linear-gradient(45deg, #ff6600, #ff8533)',
                        fontWeight: 700,
                        borderRadius: 2,
                        minWidth: 180,
                        '&:hover': { background: 'linear-gradient(45deg, #ff8533, #ff6600)' }
                      }}
                    >
                      {loading ? 'Registering...' : 'Register Team'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default CreateTeam;

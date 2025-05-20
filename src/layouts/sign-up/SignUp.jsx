import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import apiClient from '../../services/api';

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const details = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    };

    // Validate inputs
    if (!details.firstName || !details.lastName || !details.email || !details.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (details.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await apiClient.post('/signup', details);
      setSuccess(true);
      // Wait for 2 seconds to show success message before redirecting
      navigate('/signin', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = () => {
    setError('');
    setSuccess(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <VideoSettingsIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleInputChange}
                  error={!!error}
                  disabled={success}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleInputChange}
                  error={!!error}
                  disabled={success}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleInputChange}
                  error={!!error}
                  disabled={success}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleInputChange}
                  error={!!error}
                  helperText="Password must be at least 6 characters"
                  disabled={success}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Grid>
              )}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Registration successful! Redirecting to login...
                  </Alert>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || success}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin" style={{ textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.6)' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

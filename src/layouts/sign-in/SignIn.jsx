import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import apiClient from '../../services/api';

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // Clear location state after reading the message
  React.useEffect(() => {
    if (location.state?.message) {
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const postSignIn = async (details) => {
    try {
      const res = await apiClient.post('/login', details);
      if (res.data && res.data.data) {
        login(res.data.data, { email: details.email });
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    
    const data = new FormData(event.currentTarget);
    const details = {
      email: data.get('email'),
      password: data.get('password'),
    };

    if (!details.email || !details.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const result = await postSignIn(details);
      if (result.success) {
        setSuccess(true);
        navigate('/movies', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = () => {
    setError('');
    setSuccess(false);
  };

  const isFormDisabled = loading || success;

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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {location.state?.message && (
              <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
                {location.state.message}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleInputChange}
              error={!!error}
              disabled={isFormDisabled}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleInputChange}
              error={!!error}
              disabled={isFormDisabled}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Login successful! Redirecting...
              </Alert>
            )}
            <FormControlLabel
              control={
                <Checkbox 
                  value="remember" 
                  color="primary"
                  disabled={isFormDisabled}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isFormDisabled}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item xs>
                {/*<Link href="#" variant="body2">
                  Forgot password?
                </Link>*/}
              </Grid>
              <Grid item>
                <Link to="/signup" style={{ textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.6)' }}>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

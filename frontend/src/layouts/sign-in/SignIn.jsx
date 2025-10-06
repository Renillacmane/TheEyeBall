import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import banner from '../../assets/banner.png';
import apiClient from '../../services/api';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#c45d3c',
    },
    secondary: {
      main: '#e17055',
    },
  },
});

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Clear location state after reading the message
  React.useEffect(() => {
    if (location.state?.message) {
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const postSignIn = async (details) => {
    try {
        const res = await apiClient.post('/login', details);
        if (res.data && res.data.data && res.data.user) {
          login(res.data.data, res.data.user);
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
      <Container component="main" maxWidth="xs" id="signin-container">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          id="signin-content"
        >
          <Box
            component="img"
            src={banner}
            alt="TheEyeBall"
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              mb: 3
            }}
            id="signin-banner"
          />
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            noValidate 
            sx={{ 
              mt: 0,
              width: '100%',
              '& .MuiTextField-root': { mb: 2 },
              '& .MuiButton-root': { mt: 3, mb: 2, py: 1.5 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 3,
              boxShadow: 1
            }}
            id="signin-form"
          >
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(45deg, #c45d3c 30%, #e17055 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                mb: 2
              }}
              id="signin-title"
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: 'text.secondary'
              }}
              id="signin-subtitle"
            >
              Sign in to continue your movie journey
            </Typography>
            
            {location.state?.message && (
              <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
                {location.state.message}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="signin-email"
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
              type={showPassword ? 'text' : 'password'}
              id="signin-password"
              autoComplete="current-password"
              onChange={handleInputChange}
              error={!!error}
              disabled={isFormDisabled}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      disabled={isFormDisabled}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }} id="signin-error">
                {error}
              </Typography>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 1 }} id="signin-success">
                Login successful! Redirecting...
              </Alert>
            )}
            <FormControlLabel
              control={
                <Checkbox 
                  value="remember" 
                  color="primary"
                  disabled={isFormDisabled}
                  id="signin-remember"
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                background: 'linear-gradient(45deg, #c45d3c 30%, #e17055 90%)',
                boxShadow: '0 3px 5px 2px rgba(196, 93, 60, .3)',
                ':hover': {
                  background: 'linear-gradient(45deg, #b54d2c 30%, #c45d3c 90%)',
                }
              }}
              disabled={isFormDisabled}
              id="signin-submit"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link 
                  to="/signup" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#c45d3c',
                    fontWeight: 500,
                    ':hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  id="signin-signup-link"
                >
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

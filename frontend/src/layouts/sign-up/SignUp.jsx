import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircle from '@mui/icons-material/CheckCircle';
import InputAdornment from '@mui/material/InputAdornment';
import banner from '../../assets/banner.png';
import apiClient from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordMatch, setPasswordMatch] = React.useState(true);
  const [passwordsMatchConfirmed, setPasswordsMatchConfirmed] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
      confirmPassword: data.get('confirmPassword'),
    };

    // Validate inputs
    if (!details.firstName || !details.lastName || !details.email || !details.password || !details.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (details.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (details.password !== details.confirmPassword) {
      setError('Passwords do not match');
      setPasswordMatch(false);
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword from the request to backend
      const { confirmPassword, ...signupData } = details;
      const response = await apiClient.post('/signup', signupData);
      
      // Auto-login after successful signup
      if (response.data && response.data.data && response.data.user) {
        login(response.data.data, response.data.user);
        setSuccess(true);
        // Redirect to movies page after successful signup and auto-login
        setTimeout(() => {
          navigate('/movies', { replace: true });
        }, 1500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setError('');
    setSuccess(false);
    setPasswordMatch(true);
    setPasswordsMatchConfirmed(false);
    
    // Check password match in real-time
    if (event.target.name === 'password' || event.target.name === 'confirmPassword') {
      const form = event.target.closest('form');
      if (form) {
        const password = form.querySelector('input[name="password"]')?.value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]')?.value;
        
        if (password && confirmPassword) {
          if (password === confirmPassword) {
            setPasswordMatch(true);
            setPasswordsMatchConfirmed(true);
          } else {
            setPasswordMatch(false);
            setPasswordsMatchConfirmed(false);
          }
        } else {
          setPasswordMatch(true);
          setPasswordsMatchConfirmed(false);
        }
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" id="signup-container">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          id="signup-content"
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
            id="signup-banner"
          />
          <Box 
            component="form" 
            noValidate 
            onSubmit={handleSubmit} 
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
            id="signup-form"
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
              id="signup-title"
            >
              Join TheEyeBall
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: 'text.secondary'
              }}
              id="signup-subtitle"
            >
              Create an account to start exploring movies
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="signup-firstname"
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
                  id="signup-lastname"
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
                  id="signup-email"
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
                  type={showPassword ? 'text' : 'password'}
                  id="signup-password"
                  autoComplete="new-password"
                  onChange={handleInputChange}
                  error={!!error || !passwordMatch}
                  helperText="Password must be at least 6 characters"
                  disabled={success}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          disabled={success}
                          edge="end"
                          id="signup-password-toggle"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="signup-confirm-password"
                  autoComplete="new-password"
                  onChange={handleInputChange}
                  error={!!error || (!passwordMatch && passwordsMatchConfirmed === false)}
                  helperText={
                    !passwordMatch && passwordsMatchConfirmed === false 
                      ? "Passwords do not match" 
                      : passwordsMatchConfirmed 
                        ? "✓ Passwords match!" 
                        : "Re-enter your password"
                  }
                  disabled={success}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {passwordsMatchConfirmed && (
                          <CheckCircle 
                            sx={{ 
                              color: 'success.main', 
                              mr: 1,
                              fontSize: 20
                            }} 
                          />
                        )}
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          disabled={success}
                          edge="end"
                          id="signup-confirm-password-toggle"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2" id="signup-error">
                    {error}
                  </Typography>
                </Grid>
              )}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success" id="signup-success">
                    Registration successful! You're now logged in. Redirecting to movies...
                  </Alert>
                </Grid>
              )}
            </Grid>
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
              disabled={loading || success || !passwordMatch}
              id="signup-submit"
            >
              {loading ? 'Signing up...' : !passwordMatch ? 'Passwords must match' : passwordsMatchConfirmed ? 'Ready to Sign Up!' : 'Sign Up'}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link 
                  to="/signin" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#c45d3c',
                    fontWeight: 500,
                    ':hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  id="signup-signin-link"
                >
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

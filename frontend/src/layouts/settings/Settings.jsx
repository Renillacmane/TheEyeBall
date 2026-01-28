import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BottomNav from '../../components/BottomNav';

function Settings() {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        minHeight: '100vh',
        pb: 6
      }}
    >
      <Header />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              mb: 4,
              color: '#c45d3c',
              fontWeight: 600
            }}
          >
            Settings
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#c45d3c', mb: 2 }}>
              Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Account settings and preferences coming soon...
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#c45d3c', mb: 2 }}>
              Preferences
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Movie preferences and notification settings coming soon...
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer
        title="TheEyeBall"
        description="Discover your next favorite movie"
      />
      <BottomNav />
    </Box>
  );
}

export default Settings;

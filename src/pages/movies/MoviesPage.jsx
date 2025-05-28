import React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MoviesList from '../../components/MoviesList';

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

export default function MoviesPage({ title, endpoint }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: '#fff',
          minHeight: '100vh',
          pb: 6
        }}
      >
        <Header />
        <MoviesList 
          title={title} 
          endpoint={endpoint}
        />
      </Box>
      <Footer
        title="TheEyeBall"
        description="Discover your next favorite movie"
      />
    </ThemeProvider>
  );
}

MoviesPage.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired
};

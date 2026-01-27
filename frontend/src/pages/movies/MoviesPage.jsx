import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useSearchParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery, useTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SortIcon from '@mui/icons-material/Sort';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MoviesList from '../../components/MoviesList';
import BottomNav from '../../components/BottomNav';
import MoviesService from '../../services/moviesService';

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

function MoviesPageContent({ title, endpoint }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const sortOrder = searchParams.get('sort') || 'desc';
  const displayTitle = searchQuery ? `Search Results for "${searchQuery}"` : title;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleSort = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSortOrder);
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');
      try {
        const url = searchQuery ? `${endpoint}?q=${searchQuery}` : endpoint;
        const data = await MoviesService.fetchMovies(
          url,
          location.pathname === '/movies/search' ? sortOrder : null
        );
        setMovies(data);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err.message || 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint, searchQuery, location.pathname, sortOrder]);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: '#fff',
          minHeight: '100vh',
          pb: { xs: 8, sm: 6 }, // Extra padding on mobile for bottom nav
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Header />
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: location.pathname === '/movies/search' ? 'space-between' : 'center', 
          px: { xs: 1, sm: 2, md: 3 }, 
          mb: { xs: 2, sm: 4 }, 
          mt: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 0 }
        }}>
          <Typography
            component="h1"
            variant="h4"
            align={location.pathname === '/movies/search' ? 'left' : 'center'}
            sx={{ 
              color: '#c45d3c',
              fontWeight: 600,
              width: location.pathname === '/movies/search' ? 'auto' : '100%',
              fontSize: { xs: '1.5rem', sm: '2.125rem' },
              px: { xs: 1, sm: 0 }
            }}
          >
            {displayTitle}
          </Typography>
          {location.pathname === '/movies/search' && !isMobile && (
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={toggleSort}
              sx={{
                color: '#c45d3c',
                borderColor: '#c45d3c',
                '&:hover': {
                  borderColor: '#b54d2c',
                  backgroundColor: 'rgba(196, 93, 60, 0.08)'
                }
              }}
            >
              Release Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
            </Button>
          )}
        </Box>
        <MoviesList 
          movies={movies}
          loading={loading}
          error={error}
        />
      </Box>
      <Footer
        title="TheEyeBall"
        description="Discover your next favorite movie"
      />
      <BottomNav />
    </>
  );
}

export default function MoviesPage({ title, endpoint }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <MoviesPageContent title={title} endpoint={endpoint} />
    </ThemeProvider>
  );
}

MoviesPage.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MovieModal from '../../components/MovieModal';
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

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const movieData = await MoviesService.fetchMovieDetails(id);
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleReaction = async (movieId, newReaction) => {
    // Update local state
    setMovie(current => 
      current ? { ...current, userReaction: newReaction } : null
    );
  };

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
        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress 
              sx={{ 
                color: '#c45d3c',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }} 
            />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              my: 2,
              mx: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#c45d3c'
              }
            }}
          >
            {error}
          </Alert>
        ) : movie ? (
          <MovieModal
            open={true}
            onClose={handleClose}
            movie={movie}
            onNext={() => {}} // Disable navigation on detail page
            onPrevious={() => {}} // Disable navigation on detail page
            onReaction={handleReaction}
            isFirst={true}
            isLast={true}
          />
        ) : null}
      </Box>
      <Footer
        title="TheEyeBall"
        description="Discover your next favorite movie"
      />
    </ThemeProvider>
  );
}

import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MovieCard from './MovieCard';
import apiClient from '../services/api';

function MoviesList({ title, endpoint }) {
  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    // Reset states when endpoint changes
    setError('');
    setLoading(true);
    setMovies([]);

    const fetchMovies = async () => {
      try {
        const response = await apiClient.get(endpoint);
        console.log('API Response:', response);

        if (!response.data) {
          throw new Error('No data received from the server');
        }

        if (!Array.isArray(response.data)) {
          console.warn('Unexpected data format:', response.data);
          throw new Error('Invalid data format received from the server');
        }

        setMovies(response.data);
      } catch (err) {
        console.error(`Error fetching movies for ${endpoint}:`, {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        let errorMessage = 'Failed to load movies. ';
        if (err.response?.status === 401) {
          errorMessage += 'Authentication error. Please try signing in again.';
        } else if (err.response?.data?.message) {
          errorMessage += err.response.data.message;
        } else {
          errorMessage += 'Please try again later.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint]);

  return (
    <Container maxWidth="lg">
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{ 
          color: '#c45d3c',
          fontWeight: 600,
          mb: 4,
          mt: 2
        }}
        id="page-title"
      >
        {title}
      </Typography>
      <main>
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
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#c45d3c'
              }
            }}
          >
            {error}
          </Alert>
        ) : movies.length === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              my: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#e17055'
              }
            }}
          >
            No movies found.
          </Alert>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id || movie.title} 
                movie={movie} 
              />
            ))}
          </Grid>
        )}
      </main>
    </Container>
  );
}

MoviesList.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired
};

export default MoviesList;

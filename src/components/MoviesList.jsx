import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MovieCard from './MovieCard';

function MoviesList({ movies, loading, error }) {
  return (
    <Container maxWidth="lg">
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
  movies: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

MoviesList.defaultProps = {
  error: ''
};

export default MoviesList;

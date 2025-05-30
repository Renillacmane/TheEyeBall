import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';

function MoviesList({ movies, loading, error }) {
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleNextMovie = () => {
    const currentIndex = movies.findIndex(movie => movie.id === selectedMovie.id);
    if (currentIndex < movies.length - 1) {
      setSelectedMovie(movies[currentIndex + 1]);
    }
  };

  const handlePreviousMovie = () => {
    const currentIndex = movies.findIndex(movie => movie.id === selectedMovie.id);
    if (currentIndex > 0) {
      setSelectedMovie(movies[currentIndex - 1]);
    }
  };

  return (
    <>
    <Container maxWidth="lg" sx={{ position: 'relative' }}>
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
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </Grid>
        )}
      </main>
    </Container>
    <MovieModal
      open={modalOpen}
      onClose={handleCloseModal}
      movie={selectedMovie}
      onNext={handleNextMovie}
      onPrevious={handlePreviousMovie}
      isFirst={selectedMovie ? movies.findIndex(movie => movie.id === selectedMovie.id) === 0 : false}
      isLast={selectedMovie ? movies.findIndex(movie => movie.id === selectedMovie.id) === movies.length - 1 : false}
    />
    </>
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

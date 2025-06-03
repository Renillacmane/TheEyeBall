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
    // Use the version from moviesWithReactions to get latest reaction state
    const movieWithReaction = moviesWithReactions.find(m => m.id === movie.id);
    setSelectedMovie(movieWithReaction);
    setModalOpen(true);
  };

  // Keep track of movies with reactions
  const [moviesWithReactions, setMoviesWithReactions] = React.useState(movies);

  React.useEffect(() => {
    setMoviesWithReactions(movies);
  }, [movies]);

  const handleReaction = (movieId, newReaction) => {
    setMoviesWithReactions(current => 
      current.map(movie => 
        movie.id === movieId 
          ? { ...movie, userReaction: newReaction }
          : movie
      )
    );
  };

  const handleCloseModal = (lastReaction) => {
    if (lastReaction !== undefined && selectedMovie) {
      handleReaction(selectedMovie.id, lastReaction);
    }
    setModalOpen(false);
  };

  const handleNextMovie = () => {
    const currentIndex = moviesWithReactions.findIndex(movie => movie.id === selectedMovie.id);
    if (currentIndex < moviesWithReactions.length - 1) {
      setSelectedMovie(moviesWithReactions[currentIndex + 1]);
    }
  };

  const handlePreviousMovie = () => {
    const currentIndex = moviesWithReactions.findIndex(movie => movie.id === selectedMovie.id);
    if (currentIndex > 0) {
      setSelectedMovie(moviesWithReactions[currentIndex - 1]);
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
            {moviesWithReactions.map((movie) => (
              <MovieCard 
                key={movie.id || movie.title}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
                onReaction={handleReaction}
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
      onReaction={handleReaction}
      isFirst={selectedMovie ? moviesWithReactions.findIndex(movie => movie.id === selectedMovie.id) === 0 : false}
      isLast={selectedMovie ? moviesWithReactions.findIndex(movie => movie.id === selectedMovie.id) === moviesWithReactions.length - 1 : false}
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

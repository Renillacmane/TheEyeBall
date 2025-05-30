import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  Dialog, DialogContent, IconButton, Typography, Box, 
  CircularProgress, Alert, Chip, Grid, Divider, 
  ImageList, ImageListItem
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MovieIcon from '@mui/icons-material/Movie';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import MoviesService from '../services/moviesService';

  function MovieModal({ open, onClose, movie, onNext, onPrevious, isFirst, isLast }) {
  const [movieDetails, setMovieDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movie?.id) return;
      
      setLoading(true);
      setError(null);
      try {
        const details = await MoviesService.fetchMovieDetails(movie.id);
        setMovieDetails(details);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (open && movie) {
      fetchMovieDetails();
    } else {
      setMovieDetails(null);
      setError(null);
    }
  }, [open, movie?.id]);

  const defaultImage = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (!open) return;
      
      if (event.key === 'ArrowLeft' && !isFirst) {
        onPrevious();
      } else if (event.key === 'ArrowRight' && !isLast) {
        onNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, onNext, onPrevious, onClose, isFirst, isLast]);

  if (!movie) return null;

  const displayMovie = movieDetails || movie;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '900px',
          maxWidth: '90vw',
          height: '450px',
          position: 'relative',
          margin: '40px'
        }
      }}
      sx={{
        '.MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'fixed',
          right: '20px',
          top: '20px',
          padding: '8px',
          color: '#e17055',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: '#fff',
            color: '#c45d3c',
            transform: 'scale(1.1)',
          },
          transition: 'transform 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
          },
          zIndex: 1500
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '450px' }}>
          <Box
            component="img"
            sx={{
              width: { xs: '100%', md: 300 },
              height: { xs: '300px', md: '450px' },
              objectFit: 'cover',
              flexShrink: 0,
              position: 'relative'
            }}
            src={displayMovie.poster_path ? `https://image.tmdb.org/t/p/w500${displayMovie.poster_path}` : defaultImage}
            alt={`${displayMovie.title} poster`}
          />
          
          <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto', height: '450px' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress sx={{ color: '#c45d3c' }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        backgroundColor: () => {
                          const score = displayMovie.vote_average;
                          if (score < 4) return '#e74c3c';  // Red
                          if (score < 6) return '#e67e22';  // Orange
                          // Linear interpolation from light green to dark green for scores 6-10
                          const intensity = (score - 6) / 8;  // 0 to 1
                          return `rgb(${Math.round(150 - 78*intensity)}, ${Math.round(188 - 34*intensity)}, ${Math.round(149 - 90*intensity)})`;
                        },
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      {displayMovie.vote_average?.toFixed(1)}
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h4" sx={{ color: '#c45d3c', fontWeight: 600 }}>
                        {displayMovie.title}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold',
                          color: displayMovie.popularity > (displayMovie.vote_count/2) ? '#2ecc71' : '#f1c40f'
                        }}>
                          {displayMovie.popularity?.toFixed(1)}+
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          (#️{displayMovie.vote_count?.toLocaleString()})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {displayMovie.genres && displayMovie.genres.map(genre => (
                      <Chip 
                        key={genre.id} 
                        label={genre.name} 
                        sx={{ 
                          height: '20px',
                          fontSize: '0.7rem',
                          bgcolor: '#fff3ef',
                          color: '#e17055',
                          '&:hover': {
                            bgcolor: '#ffe4dc',
                          },
                          borderColor: '#e17055'
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Release date: {new Date(displayMovie.release_date).toLocaleDateString()}
                    </Typography>
                    {displayMovie.status && ['upcoming', 'nowPlaying'].includes(displayMovie.status.toLowerCase()) && (
                      <Chip 
                        label={displayMovie.status} 
                        sx={{ 
                          height: '20px',
                          fontSize: '0.7rem',
                          bgcolor: displayMovie.upcoming ? '#e3f2fd' : 
                                 displayMovie.nowPlaying ? '#e8f5e9' : 
                                 '#f5f5f5',
                          color: displayMovie.upcoming ? '#1976d2' : 
                                displayMovie.nowPlaying ? '#2e7d32' : 
                                '#757575',
                          borderColor: 'currentColor'
                        }}
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="body1" paragraph>
                    {displayMovie.overview}
                  </Typography>
                </Grid>

                <Grid item xs={12}>

                  {((displayMovie.director || displayMovie.producer || (displayMovie.mainCast && displayMovie.mainCast.length > 0))) && (
                    <Box sx={{ 
                      mb: 2,
                      p: 1.5,
                      backgroundColor: '#fff3ef',
                      borderRadius: 1
                    }}>
                      {displayMovie.director && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Director:</strong> {displayMovie.director.name}
                        </Typography>
                      )}
                      
                      {displayMovie.producer && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Producer:</strong> {displayMovie.producer.name}
                        </Typography>
                      )}

                      {displayMovie.mainCast && (
                        <>
                          <Typography variant="body2">
                            <strong>Main Cast: </strong>
                            {displayMovie.mainCast.map((actor, index) => (
                              <React.Fragment key={actor.id}>
                                <span style={{ textDecoration: 'underline' }}>{actor.name}</span> as {actor.character}
                                {index < displayMovie.mainCast.length - 1 ? ', ' : '...'}
                              </React.Fragment>
                            ))}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ color: '#e17055', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AttachMoneyIcon /> Financial
                    </Typography>
                    <Typography variant="body2">
                      Budget: ${displayMovie.budget?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Revenue: ${displayMovie.revenue?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Box>

                </Grid>

                  <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ color: '#e17055', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <MovieIcon /> Production
                    </Typography>
                    {displayMovie.production_companies?.slice(0, 3).map(company => (
                      <Typography key={company.id} variant="body2">
                        {company.name}
                      </Typography>
                    ))}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Languages: {displayMovie.spoken_languages?.map(lang => lang.iso_639_1.toUpperCase()).join(', ')}
                    </Typography>
                  </Box>

                </Grid>


                {displayMovie.backdrops && displayMovie.backdrops.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ mt: 0, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#e17055', mb: 2 }}>
                      Gallery
                    </Typography>
                    <Box 
                      sx={{ 
                        mb: 2,
                        height: 200,
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.08)'
                        }
                      }}
                      onClick={() => {/* TODO: Add trailer functionality */}}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e17055', mb: 1 }}>
                          <PlayArrowIcon sx={{ fontSize: 40 }} />
                          <MovieIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Click to watch trailer
                        </Typography>
                      </Box>
                    </Box>
                    <ImageList cols={2} gap={8} sx={{ mb: 2 }}>
                      {displayMovie.backdrops.slice(0, 4).map((image, index) => (
                        <ImageListItem key={index}>
                          <Box
                            component="img"
                            src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                            loading="lazy"
                            alt={`Scene ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Box>

          <IconButton
            onClick={onPrevious}
            disabled={isFirst}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

          <IconButton
            onClick={onNext}
            disabled={isLast}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
}

MovieModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
    vote_count: PropTypes.number,
    popularity: PropTypes.number,
    budget: PropTypes.number,
    revenue: PropTypes.number,
    status: PropTypes.string,
    upcoming: PropTypes.bool,
    nowPlaying: PropTypes.bool,
    genres: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })),
    spoken_languages: PropTypes.arrayOf(PropTypes.shape({
      iso_639_1: PropTypes.string,
      name: PropTypes.string
    })),
    production_companies: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })),
    director: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      job: PropTypes.string
    }),
    producer: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      job: PropTypes.string
    }),
    mainCast: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      character: PropTypes.string
    })),
    backdrops: PropTypes.arrayOf(PropTypes.shape({
      file_path: PropTypes.string
    }))
  }),
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
};

MovieModal.defaultProps = {
  isFirst: false,
  isLast: false,
};

export default MovieModal;

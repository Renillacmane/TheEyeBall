import * as React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
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
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MoviesService, { REACTIONS } from '../services/moviesService';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RatingBadge from './RatingBadge';

  function MovieModal({ open, onClose, movie, onNext, onPrevious, isFirst, isLast, onReaction }) {
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [userReaction, setUserReaction] = React.useState(REACTIONS.NONE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleReaction = async (type) => {
    if (isSubmitting || !movie?.id) return;

    try {
      setIsSubmitting(true);
      const newReaction = type === userReaction ? REACTIONS.NONE : type;
      await MoviesService.createReaction(movie.id, newReaction);
      setUserReaction(newReaction);
      if (onReaction) {
        onReaction(movie.id, newReaction);
      }
    } catch (error) {
      console.error('Failed to submit reaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsMaximized(false);
    onClose();
  };

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
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: isMaximized ? '100vw' : '900px',
          maxWidth: isMaximized ? '100vw' : '90vw',
          height: isMaximized ? '100vh' : '450px',
          position: 'relative',
          margin: isMaximized ? 0 : '40px',
          transition: 'all 0.3s ease-in-out'
        }
      }}
      sx={{
        '.MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <Box sx={{ position: 'fixed', right: '20px', top: '20px', zIndex: 1500, display: 'flex', gap: 1 }}>
        <IconButton
          onClick={handleMaximizeToggle}
          sx={{
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
            }
          }}
        >
          {isMaximized ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
        </IconButton>
        <IconButton
          onClick={handleClose}
          sx={{
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
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            height: isMaximized ? '100vh' : '450px',
            transition: 'height 0.3s ease-in-out'
          }}>
          <Box
            component="img"
            sx={{
              width: { xs: '100%', md: isMaximized ? '500px' : '300px' },
              height: { xs: '300px', md: '100%' },
              objectFit: isMaximized ? 'contain' : 'cover',
              flexShrink: 0,
              position: 'relative'
            }}
            src={displayMovie.poster_path ? `https://image.tmdb.org/t/p/w500${displayMovie.poster_path}` : defaultImage}
            alt={`${displayMovie.title} poster`}
          />
          
          <Box sx={{ 
            p: 3, 
            flexGrow: 1, 
            overflow: 'auto', 
            height: isMaximized ? '100vh' : '450px',
            transition: 'height 0.3s ease-in-out'
          }}>
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
                    <RatingBadge rating={displayMovie.vote_average} size={45} />
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
                        <Typography variant="h4" sx={{ color: '#c45d3c', fontWeight: 600, pr: 7 }}>
                          {displayMovie.title}
                        </Typography>
                        <IconButton
                          onClick={() => handleReaction(REACTIONS.LIKE)}
                          disabled={isSubmitting}
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#e17055',
                            padding: 2,
                            '& .MuiSvgIcon-root': {
                              fontSize: 34
                            },
                            '&:hover': {
                              color: '#e17055',
                              backgroundColor: 'rgba(225, 112, 85, 0.04)'
                            }
                          }}
                        >
                          {userReaction === REACTIONS.LIKE ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
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

                  <Box sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: 'text.secondary'
                      }}>
                        {displayMovie.popularity?.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (#️{displayMovie.vote_count?.toLocaleString()})
                      </Typography>
                    </Box>
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

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ color: '#e17055', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AttachMoneyIcon /> Financial
                    </Typography>
                    <Typography variant="body2">
                      Budget: <Box component="span">
                        ${displayMovie.budget?.toLocaleString() || 'N/A'}
                      </Box>
                    </Typography>
                    <Typography variant="body2">
                      Revenue: <Box 
                        component="span" 
                        sx={{
                          color: displayMovie.revenue && displayMovie.budget
                            ? displayMovie.revenue > displayMovie.budget
                              ? '#27ae60'  // Softer green for profit
                              : '#e74c3c'  // Red for loss
                            : 'inherit'    // Default color if either value is missing
                        }}
                      >
                        ${displayMovie.revenue?.toLocaleString() || 'N/A'}
                      </Box>
                    </Typography>
                  </Box>
                </Grid>


                {displayMovie.backdrops && displayMovie.backdrops.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ mt: 0, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#e17055', mb: 2 }}>
                      Gallery
                    </Typography>
                    {displayMovie.trailer ? (
                      <Box 
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          borderRadius: 1,
                          overflow: 'hidden',
                          position: 'relative',
                          paddingTop: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625)
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                          <YouTube
                            videoId={displayMovie.trailer.key}
                            opts={{
                              width: '100%',
                              height: '100%',
                              playerVars: {
                                autoplay: 0,
                                modestbranding: 1,
                                rel: 0
                              }
                            }}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Box 
                        sx={{ 
                          mb: 2,
                          height: 200,
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#bbb', mb: 1 }}>
                            <MovieIcon sx={{ fontSize: 32 }} />
                          </Box>
                          <Typography variant="body2" color="text.disabled">
                            No official trailer available
                          </Typography>
                        </Box>
                      </Box>
                    )}
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
    })),
    trailer: PropTypes.shape({
      key: PropTypes.string,
      site: PropTypes.string,
      type: PropTypes.string,
      official: PropTypes.bool
    })
  }),
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
};

MovieModal.defaultProps = {
  isFirst: false,
  isLast: false,
  onReaction: PropTypes.func
};

export default MovieModal;

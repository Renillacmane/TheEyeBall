import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, Grid, Card, CardContent, CardMedia,
  IconButton, Box, useMediaQuery, useTheme
} from '@mui/material';
import RatingBadge from './RatingBadge';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { REACTIONS, MoviesService } from '../services/moviesService';

function MovieCard({ movie, onClick, onReaction }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userReaction, setUserReaction] = React.useState(movie.userReaction || REACTIONS.NONE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setUserReaction(movie.userReaction || REACTIONS.NONE);
  }, [movie.userReaction]);

  const handleReaction = async (event) => {
    event.stopPropagation(); // Prevent card click when clicking reaction
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newReaction = userReaction === REACTIONS.LIKE ? REACTIONS.NONE : REACTIONS.LIKE;
      await MoviesService.handleUserReaction(movie.id, newReaction);
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

  const defaultImage = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';

  return (
    <Grid item xs={12} md={6} id={`movie-card-${movie.id}`} sx={{ width: '100%', px: { xs: 0, sm: 1.5, md: 2 } }}>
      <Card
        onClick={onClick}
        component="div"
        role="button"
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          maxWidth: '100%',
          height: '100%',
          m: 0,
          boxShadow: '0 3px 5px 2px rgba(196, 93, 60, .1)',
          ':hover': {
            boxShadow: '0 6px 10px 4px rgba(196, 93, 60, .2)',
            cursor: 'pointer'
          },
          transition: 'box-shadow 0.3s ease-in-out'
        }}
      >
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', sm: 160 },
            maxWidth: { xs: '100%', sm: 160 },
            height: { xs: '350px', sm: 'auto' },
            mx: { xs: 'auto', sm: 0 },
            objectFit: { xs: 'contain', sm: 'cover' },
            objectPosition: 'center',
            display: 'block',
            borderRight: { xs: 'none', sm: '4px solid rgba(196, 93, 60, 0.1)' },
            // borderBottom: { xs: '4px solid rgba(196, 93, 60, 0.1)', sm: 'none' },
            backgroundColor: { xs: '#f5f5f5', sm: 'transparent' }
          }}
          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : defaultImage}
          alt={`${movie.title} poster`}
        />
        <CardContent sx={{ 
          flex: 1, 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 3, sm: 2 }
        }}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute',
              left: { xs: 12, sm: -16 },
              top: { xs: -12, sm: -12 },
              zIndex: 1
            }}>
              <RatingBadge rating={movie.vote_average} size={isMobile ? 50 : 32} />
            </Box>
            <Typography 
              component="h2" 
              variant="h4" 
              sx={{ 
                color: '#c45d3c',
                fontWeight: 600,
                mb: { xs: 2, sm: 2 },
                pl: { xs: 0, sm: 2 },
                fontSize: { xs: '2.25rem', sm: '2.125rem' },
                wordBreak: 'break-word',
                lineHeight: { xs: 1.2, sm: 1.4 }
              }}
            >
              {movie.title}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            paragraph
            sx={{ 
              minHeight: { xs: '6em', sm: '4.5em' },
              fontSize: { xs: '1.125rem', sm: '0.875rem' },
              display: '-webkit-box',
              WebkitLineClamp: { xs: 5, sm: 3 },
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              mb: { xs: 2, sm: 2 },
              lineHeight: { xs: 1.6, sm: 1.5 }
            }}
          >
            {movie.overview}
          </Typography>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto'
          }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '0.875rem' }
              }}
            >
              Release date: {new Date(movie.release_date).toLocaleDateString()}
            </Typography>
            <IconButton
              size={isMobile ? 'medium' : 'small'}
              onClick={handleReaction}
              disabled={isSubmitting}
              sx={{
                color: '#e17055',
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1.75rem', sm: '1.5rem' }
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
        </CardContent>
      </Card>
    </Grid>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onReaction: PropTypes.func
};

export default MovieCard;

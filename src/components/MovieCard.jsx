import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, Grid, Card, CardContent, CardMedia,
  IconButton, Box
} from '@mui/material';
import RatingBadge from './RatingBadge';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { REACTIONS, MoviesService } from '../services/moviesService';

function MovieCard({ movie, onClick, onReaction }) {
  const [userReaction, setUserReaction] = React.useState(REACTIONS.NONE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleReaction = async (event) => {
    event.stopPropagation(); // Prevent card click when clicking reaction
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newReaction = userReaction === REACTIONS.LIKE ? REACTIONS.NONE : REACTIONS.LIKE;
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

  const defaultImage = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';

  return (
    <Grid item xs={12} md={6} id={`movie-card-${movie.id}`}>
      <Card
        onClick={onClick}
        component="div"
        role="button"
        sx={{ 
          display: 'flex', 
          height: '100%',
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
            width: 160, 
            display: { xs: 'none', sm: 'block' },
            borderRight: '4px solid rgba(196, 93, 60, 0.1)'
          }}
          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : defaultImage}
          alt={`${movie.title} poster`}
        />
        <CardContent sx={{ flex: 1, position: 'relative' }}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute',
              left: -16,
              top: -12,
              zIndex: 1
            }}>
              <RatingBadge rating={movie.vote_average} size={32} />
            </Box>
            <Typography 
              component="h2" 
              variant="h4" 
              sx={{ 
                color: '#c45d3c',
                fontWeight: 600,
                mb: 2,
                pl: 2
              }}
            >
              {movie.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Release date: {new Date(movie.release_date).toLocaleDateString()}
          </Typography>
          <Typography 
            variant="body2" 
            paragraph
            sx={{ 
              minHeight: '4.5em',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {movie.overview}
          </Typography>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 'auto'
          }}>
            <IconButton
              size="small"
              onClick={handleReaction}
              disabled={isSubmitting}
              sx={{
                color: '#e17055',
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

import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function MovieCard({ movie }) {
  const defaultImage = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';

  return (
    <Grid item xs={12} md={6} id={`movie-card-${movie.id}`}>
      <Card 
        sx={{ 
          display: 'flex', 
          height: '100%',
          boxShadow: '0 3px 5px 2px rgba(196, 93, 60, .1)',
          ':hover': {
            boxShadow: '0 6px 10px 4px rgba(196, 93, 60, .2)',
          },
          transition: 'box-shadow 0.3s ease-in-out'
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Typography 
            component="h2" 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: '#c45d3c',
              fontWeight: 600
            }}
          >
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
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
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#e17055',
              fontWeight: 500
            }}
          >
            Rating: {movie.vote_average}/10
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          sx={{ 
            width: 160, 
            display: { xs: 'none', sm: 'block' },
            borderLeft: '4px solid rgba(196, 93, 60, 0.1)'
          }}
          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : defaultImage}
          alt={`${movie.title} poster`}
        />
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
};

export default MovieCard;

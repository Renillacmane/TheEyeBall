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
    <Grid item xs={12} md={6}>
      <Card sx={{ display: 'flex', height: '100%' }}>
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Release date: {new Date(movie.release_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" paragraph>
            {movie.overview}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Rating: {movie.vote_average}/10
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : defaultImage}
          alt={`${movie.title} poster`}
        />
      </Card>
    </Grid>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired,
};

export default MovieCard;

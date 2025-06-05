import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, List, ListItem, ListItemText, IconButton, Chip, Alert, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { MoviesService, REACTIONS } from '../../services/moviesService';

// Genre color mapping enum
const GENRE_COLORS = {
  28: '#FF6B6B', // Action - Red
  12: '#4ECDC4', // Adventure - Teal
  16: '#45B7D1', // Animation - Blue
  35: '#FFA07A', // Comedy - Light Salmon
  80: '#6C5CE7', // Crime - Purple
  99: '#FDCB6E', // Documentary - Yellow
  18: '#E17055', // Drama - Orange
  10751: '#A29BFE', // Family - Light Purple
  14: '#74B9FF', // Fantasy - Light Blue
  36: '#81ECEC', // History - Light Cyan
  27: '#2D3436', // Horror - Dark Gray
  10402: '#00B894', // Music - Green
  9648: '#636E72', // Mystery - Gray
  10749: '#FF7675', // Romance - Pink
  878: '#00CEC9', // Science Fiction - Cyan
  10770: '#FDCB6E', // TV Movie - Yellow
  53: '#E84393', // Thriller - Magenta
  10752: '#DDA0DD', // War - Plum
  37: '#CD853F'  // Western - Peru
};

const DEFAULT_GENRE_COLOR = '#74B9FF'; // Default light blue

function MyPicks() {
  const { user } = useAuth();
  const [topGenres, setTopGenres] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPicksData = async () => {
      try {
        setLoading(true);
        
        // Fetch both genres and movies in parallel using the authenticated API service
        const [genresData, moviesData] = await Promise.all([
          MoviesService.fetchUserTopGenres(),
          MoviesService.fetchUserLikedMovies()
        ]);

        setTopGenres(genresData);
        setLikedMovies(moviesData);
      } catch (err) {
        console.error('Error fetching My Picks data:', err);
        setError('Failed to load your picks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPicksData();
  }, []);

  const handleUnlikeMovie = async (movieId) => {
    try {
      await MoviesService.handleUserReaction(movieId, REACTIONS.NONE);
      
      // Remove the movie from the list optimistically
      setLikedMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error('Error removing like:', err);
      // You could add a toast notification here
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getGenreColor = (genreId) => {
    return GENRE_COLORS[genreId] || DEFAULT_GENRE_COLOR;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container sx={{ flex: 1, py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        minHeight: '100vh',
        pb: 6
      }}
    >
      <Header />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, mb: 4, mt: 2 }}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          sx={{ 
            color: '#c45d3c',
            fontWeight: 600,
            width: '100%'
          }}
        >
          My Picks
        </Typography>
      </Box>
      <Container>

        {/* Top Genres Section */}
        <Box sx={{ mb: '5px', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: '#c45d3c', fontWeight: 500, minWidth: 'fit-content' }}>
            Top Genres:
          </Typography>
          {topGenres.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No genre preferences yet. Like some movies to see your favorite genres!
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
              {topGenres.map((genre) => (
                <Chip
                  key={genre.genre_id}
                  label={`${genre.genre_name} (${genre.total_likes})`}
                  size="small"
                  sx={{
                    backgroundColor: getGenreColor(genre.genre_id),
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Liked Movies Section */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            {likedMovies.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No liked movies yet. Start exploring and like movies you're interested in!
              </Typography>
            ) : (
              <List>
                {likedMovies.map((movie) => (
                  <ListItem
                    key={movie.id}
                    sx={{
                      border: '1px solid rgba(196, 93, 60, 0.1)',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(196, 93, 60, 0.05)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ color: '#c45d3c', fontSize: '1.1rem' }}>
                            {movie.title}
                          </Typography>
                          {movie.genres && movie.genres.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {movie.genres.slice(0, 3).map((genre) => (
                                <Chip
                                  key={genre.id}
                                  label={genre.name}
                                  size="small"
                                  sx={{
                                    backgroundColor: getGenreColor(genre.id),
                                    color: 'white',
                                    fontWeight: 500,
                                    height: '20px',
                                    '& .MuiChip-label': {
                                      fontSize: '0.65rem',
                                      px: 1
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Liked on {formatDate(movie.likedDate)}
                        </Typography>
                      }
                    />
                    <IconButton
                      onClick={() => handleUnlikeMovie(movie.id)}
                      sx={{
                        color: '#c45d3c',
                        '&:hover': {
                          backgroundColor: 'rgba(196, 93, 60, 0.1)'
                        }
                      }}
                      aria-label={`Remove like from ${movie.title}`}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
      <Footer
        title="TheEyeBall"
        description="Discover your next favorite movie"
      />
    </Box>
  );
}

export default MyPicks;

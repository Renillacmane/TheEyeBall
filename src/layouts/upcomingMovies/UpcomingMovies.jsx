import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MovieCard from '../../components/MovieCard';
import apiClient from '../../services/api';

const defaultTheme = createTheme();

export default function UpcomingMovies() {
  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await apiClient.get('/movies');
        setMovies(response.data || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Upcoming Movies" sections={[]} />
        <main>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          ) : movies.length === 0 ? (
            <Alert severity="info" sx={{ my: 2 }}>
              No upcoming movies found.
            </Alert>
          ) : (
            <Grid container spacing={4}>
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
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}

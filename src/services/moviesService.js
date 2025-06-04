import apiClient from './api';

export const REACTIONS = {
  NONE: 0,
  LIKE: 1,
};

export const MoviesService = {
  fetchMovies: async (endpoint, sortOrder = null) => {
    const url = sortOrder ? `${endpoint}&sort=${sortOrder}` : endpoint;
    const response = await apiClient.get(url);
    return response.data;
  },

  fetchMovieDetails: async (movieId) => {
    const response = await apiClient.get(`/movies/${movieId}`);
    return response.data;
  },

  handleUserReaction: async (movieId, type) => {
    const response = await apiClient.post('/movies/reaction', {
      id_external: movieId,
      type,
      date: new Date().toISOString()
    });
    return { success: true, newReaction: type };
  }
};

export default MoviesService;

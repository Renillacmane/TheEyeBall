import apiClient from './api';

export const MoviesService = {
  fetchMovies: async (endpoint, sortOrder = null) => {
    const url = sortOrder ? `${endpoint}&sort=${sortOrder}` : endpoint;
    const response = await apiClient.get(url);
    return response.data;
  },

  fetchMovieDetails: async (movieId) => {
    const response = await apiClient.get(`/movies/${movieId}`);
    return response.data;
  }
};

export default MoviesService;

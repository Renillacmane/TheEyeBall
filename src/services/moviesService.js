import apiClient from './api';

export const MoviesService = {
  fetchMovies: async (endpoint, sortOrder = null) => {
    const url = sortOrder ? `${endpoint}&sort=${sortOrder}` : endpoint;
    const response = await apiClient.get(url);
    return response.data;
  }
};

export default MoviesService;

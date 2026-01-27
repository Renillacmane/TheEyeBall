import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './layouts/sign-in/SignIn';
import SignUp from './layouts/sign-up/SignUp';
import Settings from './layouts/settings/Settings';
import MyPicks from './layouts/my-picks/MyPicks';
import MoviesPage from './pages/movies/MoviesPage';
import MovieDetailPage from './pages/movies/MovieDetailPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={
        !isAuthenticated ? <SignIn /> : <Navigate to="/movies/upcoming" replace />
      } />
      <Route path="/signup" element={
        !isAuthenticated ? <SignUp /> : <Navigate to="/movies/upcoming" replace />
      } />

      {/* Protected Routes */}
      <Route path="/movies/eyeballed" element={
        isAuthenticated ? <MoviesPage title="EyeBalled For You" endpoint="/movies/eyeballed" /> : <Navigate to="/signin" replace />
      } />
      <Route path="/movies/playing" element={
        isAuthenticated ? <MoviesPage title="Now Playing" endpoint="/movies/now-playing" /> : <Navigate to="/signin" replace />
      } />
      <Route path="/movies/upcoming" element={
        isAuthenticated ? <MoviesPage title="Upcoming Movies" endpoint="/movies/upcoming" /> : <Navigate to="/signin" replace />
      } />
      <Route path="/movies/top-rated" element={
        isAuthenticated ? <MoviesPage title="Top Rated Movies" endpoint="/movies/top-rated" /> : <Navigate to="/signin" replace />
      } />

      {/* Search Route */}
      <Route path="/movies/search" element={
        isAuthenticated ? (
          <MoviesPage 
            title="Search Results" 
            endpoint="/movies/search"
          />
        ) : <Navigate to="/signin" replace />
      } />

      {/* Movie Detail Route */}
      <Route path="/movies/:id" element={
        isAuthenticated ? <MovieDetailPage /> : <Navigate to="/signin" replace />
      } />

      {/* My Picks Route */}
      <Route path="/my-picks" element={
        isAuthenticated ? <MyPicks /> : <Navigate to="/signin" replace />
      } />

      {/* Settings Route */}
      <Route path="/settings" element={
        isAuthenticated ? <Settings /> : <Navigate to="/signin" replace />
      } />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/movies/upcoming" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/movies/upcoming" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

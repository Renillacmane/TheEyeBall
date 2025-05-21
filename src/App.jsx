import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './layouts/sign-in/SignIn';
import SignUp from './layouts/sign-up/SignUp';
import UpcomingMovies from './layouts/upcomingMovies/UpcomingMovies';
import Settings from './layouts/settings/Settings';
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
      <Route path="/movies" element={
        isAuthenticated ? <UpcomingMovies /> : <Navigate to="/signin" replace />
      } />
      <Route path="/movies/upcoming" element={
        isAuthenticated ? <UpcomingMovies /> : <Navigate to="/signin" replace />
      } />
      <Route path="/movies/top-rated" element={
        isAuthenticated ? <UpcomingMovies /> : <Navigate to="/signin" replace />
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

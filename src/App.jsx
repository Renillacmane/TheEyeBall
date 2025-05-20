import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './layouts/sign-in/SignIn';
import SignUp from './layouts/sign-up/SignUp';
import UpcomingMovies from './layouts/upcomingMovies/UpcomingMovies';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={
        !isAuthenticated ? <SignIn /> : <Navigate to="/movies" replace />
      } />
      <Route path="/signup" element={
        !isAuthenticated ? <SignUp /> : <Navigate to="/movies" replace />
      } />

      {/* Protected Routes */}
      <Route path="/movies" element={
        isAuthenticated ? <UpcomingMovies /> : <Navigate to="/signin" replace />
      } />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
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

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery, useTheme, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';

function BottomNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the current value based on the pathname
  const getCurrentValue = () => {
    if (location.pathname === '/movies/eyeballed') return 0;
    if (location.pathname === '/movies/upcoming') return 1;
    if (location.pathname === '/movies/playing') return 2;
    if (location.pathname === '/movies/top-rated') return 3;
    if (location.pathname === '/my-picks') return 4;
    return -1; // No match
  };

  const [value, setValue] = React.useState(getCurrentValue());

  // Update value when location changes
  React.useEffect(() => {
    setValue(getCurrentValue());
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/movies/eyeballed');
        break;
      case 1:
        navigate('/movies/upcoming');
        break;
      case 2:
        navigate('/movies/playing');
        break;
      case 3:
        navigate('/movies/top-rated');
        break;
      case 4:
        navigate('/my-picks');
        break;
      default:
        break;
    }
  };

  if (!isMobile) {
    return null; // Don't show on desktop
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid rgba(196, 93, 60, 0.1)'
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: '#fff',
          '& .MuiBottomNavigationAction-root': {
            color: '#e17055',
            '&.Mui-selected': {
              color: '#c45d3c',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="EyeBalled"
          icon={<FavoriteIcon />}
        />
        <BottomNavigationAction
          label="Upcoming"
          icon={<UpcomingIcon />}
        />
        <BottomNavigationAction
          label="Playing"
          icon={<PlayArrowIcon />}
        />
        <BottomNavigationAction
          label="Top Rated"
          icon={<StarIcon />}
        />
        <BottomNavigationAction
          label="My Picks"
          icon={<MovieIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;

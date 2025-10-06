import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import banner from '../assets/banner.png';

const SearchInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '8px 12px',
  border: '1px solid rgba(196, 93, 60, 0.3)',
  borderRadius: '4px',
  fontSize: '0.9rem',
  color: '#c45d3c',
  outline: 'none',
  backgroundColor: '#fff',
  transition: 'border-color 0.2s ease',
  '&:focus': {
    borderColor: '#c45d3c',
  },
  '&::placeholder': {
    color: 'rgba(196, 93, 60, 0.6)',
  }
}));

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const open = Boolean(anchorEl);

  const getUserDisplay = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    handleClose();
    if (action === 'my-picks') {
      navigate('/my-picks');
    } else if (action === 'settings') {
      navigate('/settings');
    } else if (action === 'logout') {
      logout();
      navigate('/signin');
    }
  };

  return (
    <React.Fragment>
      <Toolbar 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'rgba(196, 93, 60, 0.1)',
          mb: 3,
          minHeight: '110px',
          display: 'flex',
          alignItems: 'center',
          px: 2
        }}
      >
        <Box
          component="img"
          src={banner}
          alt="TheEyeBall"
          sx={{
            height: '90px',
            width: 'auto',
            mr: 3
          }}
          id="header-logo"
        />
        <Box sx={{ display: 'flex', gap: 3 }} id="navigation-links">
          <Link
            id="nav-eyeballed-for-you"
            color="inherit"
            noWrap
            onClick={() => navigate('/movies/eyeballed')}
            sx={{ 
              fontSize: '0.9rem',
              color: location.pathname === '/movies/eyeballed' ? '#c45d3c' : '#e17055',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: location.pathname === '/movies/eyeballed' ? 600 : 400,
              '&:hover': {
                color: '#c45d3c',
                textDecoration: 'none'
              }
            }}
          >
            EyeBalled For You
          </Link>
          <Link
            id="nav-upcoming"
            color="inherit"
            noWrap
            onClick={() => navigate('/movies/upcoming')}
            sx={{ 
              fontSize: '0.9rem',
              color: location.pathname === '/movies/upcoming' ? '#c45d3c' : '#e17055',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: location.pathname === '/movies/upcoming' ? 600 : 400,
              '&:hover': {
                color: '#c45d3c',
                textDecoration: 'none'
              }
            }}
          >
            Upcoming
          </Link>
          <Link
            id="nav-now-playing"
            color="inherit"
            noWrap
            onClick={() => navigate('/movies/playing')}
            sx={{ 
              fontSize: '0.9rem',
              color: location.pathname === '/movies/playing' ? '#c45d3c' : '#e17055',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: location.pathname === '/movies/playing' ? 600 : 400,
              '&:hover': {
                color: '#c45d3c',
                textDecoration: 'none'
              }
            }}
          >
            Now Playing
          </Link>
          <Link
            id="nav-top-rated"
            color="inherit"
            noWrap
            onClick={() => navigate('/movies/top-rated')}
            sx={{ 
              fontSize: '0.9rem',
              color: location.pathname === '/movies/top-rated' ? '#c45d3c' : '#e17055',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: location.pathname === '/movies/top-rated' ? 600 : 400,
              '&:hover': {
                color: '#c45d3c',
                textDecoration: 'none'
              }
            }}
          >
            Top Rated
          </Link>
        </Box>
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mx: 3
          }}
        >
          <SearchInput
            type="text"
            id="movie-search"
            placeholder="Search movies..."
            aria-label="Search movies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/movies/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          />
        </Box>
        <IconButton
          id="search-button"
          aria-label="Search movies"
          onClick={() => {
            if (searchQuery.trim()) {
              navigate(`/movies/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          sx={{
            color: '#c45d3c',
            '&:hover': {
              backgroundColor: 'rgba(196, 93, 60, 0.08)'
            }
          }}
        >
          <SearchIcon />
        </IconButton>
        <Box
          id="user-menu-button"
          onClick={handleMenu}
          aria-controls={open ? 'user-dropdown-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            ml: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              '& .MuiAvatar-root': {
                backgroundColor: '#b54d2c'
              },
              '& .MuiTypography-root': {
                color: '#b54d2c'
              }
            }
          }}
        >
          <Avatar
            id="user-avatar"
            aria-label="User profile picture"
            sx={{
              bgcolor: '#c45d3c',
              width: 35,
              height: 35,
              fontSize: '0.9rem'
            }}
          >
            <AccountCircleIcon />
          </Avatar>
          <Typography
            id="user-display-name"
            sx={{
              ml: 1,
              color: '#c45d3c',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {getUserDisplay()}
          </Typography>
        </Box>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'user-menu-button',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              '& .MuiMenuItem-root': {
                color: '#c45d3c',
                '&:hover': {
                  backgroundColor: 'rgba(196, 93, 60, 0.08)'
                }
              }
            }
          }}
        >
          <MenuItem id="my-picks-menu-item" onClick={() => handleMenuAction('my-picks')}>
            <ListItemIcon>
              <FavoriteIcon sx={{ color: '#c45d3c' }} />
            </ListItemIcon>
            My Picks
          </MenuItem>
          <MenuItem id="settings-menu-item" onClick={() => handleMenuAction('settings')}>
            <ListItemIcon>
              <SettingsIcon sx={{ color: '#c45d3c' }} />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem id="logout-menu-item" onClick={() => handleMenuAction('logout')}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#c45d3c' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </React.Fragment>
  );
}


export default Header;

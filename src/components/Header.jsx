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
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import banner from '../assets/banner.png';

function Header(props) {
  const { sections, title } = props;
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
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
    if (action === 'settings') {
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
        <Link
          color="inherit"
          noWrap
          href="/movies/top-rated"
          sx={{ 
            color: '#e17055',
            textDecoration: 'none',
            '&:hover': {
              color: '#c45d3c',
              textDecoration: 'none'
            }
          }}
        >
          Top Choices
        </Link>
        <Typography
          component="h2"
          variant="h5"
          align="center"
          noWrap
          sx={{ 
            flex: 1,
            color: '#c45d3c',
            fontWeight: 600
          }}
        >
          {title}
        </Typography>
        <IconButton
          id="search-button"
          aria-label="Search movies"
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
        <Toolbar
          id="navigation-toolbar"
          component="nav"
          variant="dense"
        sx={{ 
          justifyContent: 'space-between', 
          overflowX: 'auto',
          borderBottom: 1,
          borderColor: 'rgba(196, 93, 60, 0.1)',
        }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ 
              p: 1, 
              flexShrink: 0,
              color: '#e17055',
              '&:hover': {
                color: '#c45d3c',
                textDecoration: 'none'
              }
            }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;

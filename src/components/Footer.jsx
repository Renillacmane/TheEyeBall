import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'rgba(196, 93, 60, 0.7)' }} align="center">
      {'Copyright © '}
      <Link 
        href="/"
        sx={{ 
          color: '#c45d3c',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        TheEyeBall
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

function Footer(props) {
  const { description, title } = props;

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'rgba(196, 93, 60, 0.05)',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h6" 
          align="center" 
          gutterBottom
          sx={{ 
            color: '#c45d3c',
            fontWeight: 600,
            mb: 2
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: 'rgba(196, 93, 60, 0.8)',
            mb: 3
          }}
          component="p"
        >
          {description}
        </Typography>
        <Divider 
          sx={{ 
            width: '100px', 
            margin: '0 auto', 
            mb: 3,
            borderColor: 'rgba(196, 93, 60, 0.2)' 
          }} 
        />
        <Copyright />
      </Container>
    </Box>
  );
}

Footer.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Footer;

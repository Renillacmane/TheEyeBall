import * as React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

function RatingBadge({ rating, size = 45 }) {
  const getBgColor = (score) => {
    if (score < 4) return '#e74c3c';  // Red
    if (score < 6) return '#e67e22';  // Orange
    // Linear interpolation from light green to dark green for scores 6-10
    const intensity = (score - 6) / 8;  // 0 to 1
    return `rgb(${Math.round(150 - 78*intensity)}, ${Math.round(188 - 34*intensity)}, ${Math.round(149 - 90*intensity)})`;
  };

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getBgColor(rating),
        color: '#fff',
        fontWeight: 'bold',
        fontSize: size >= 40 ? '1.1rem' : '0.9rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      {rating?.toFixed(1)}
    </Box>
  );
}

RatingBadge.propTypes = {
  rating: PropTypes.number.isRequired,
  size: PropTypes.number
};

export default RatingBadge;

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState, useEffect } from 'react';

export default function LoadingIconButton() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  });
  
  const iconLoading = () => {
    setLoading(true)
  }
  return (
    <Tooltip title="Click to see loading">
      <IconButton onClick={iconLoading} loading={loading}>
        <ShoppingCartIcon />
      </IconButton>
    </Tooltip>
  );
}

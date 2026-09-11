// 


// Delete is a small menu row that asks its parent to open confirmation UI.
import { Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Delete({ setDropdownOpen, handleDelete, disabled }) {
  return (
    <Box
      sx={{
        px: 2, py: 1, display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        '&:hover': { bgcolor: disabled ? 'transparent' : '#fff0f0' },
      }}
      onClick={() => {
        if (disabled) return;
        setDropdownOpen(false);
        handleDelete();
      }}
    >
      <DeleteIcon fontSize="small" sx={{ mr: 1, color: disabled ? 'text.secondary' : 'error.main' }} />
      <Typography variant="body2" color={disabled ? 'text.secondary' : 'error'}>Delete</Typography>
    </Box>
  );
}
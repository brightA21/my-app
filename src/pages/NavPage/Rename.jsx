// 

import EditIcon from '@mui/icons-material/Edit';
// Rename is a small menu row that starts the parent's rename dialog.
import { Box, Typography } from '@mui/material';

export default function Rename({ setDropdownOpen, handleRename, disabled }) {
  return (
    <Box
      sx={{
        px: 2, py: 1, display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        '&:hover': { bgcolor: disabled ? 'transparent' : 'action.hover' },
      }}
      onClick={() => {
        if (disabled) return;
        setDropdownOpen(false);
        handleRename();
      }}
    >
      <EditIcon fontSize="small" sx={{ mr: 1 }} />
      <Typography variant="body2">Rename</Typography>
    </Box>
  );
}
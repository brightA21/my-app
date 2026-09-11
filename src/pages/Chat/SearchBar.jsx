// import SearchIcon from '@mui/icons-material/Search';
// import { InputAdornment, TextField, Box, IconButton } from '@mui/material';
// import CreateIcon from '@mui/icons-material/Create';
// import { useTheme } from '@mui/material/styles';

// export default function SearchBar({ isDark }) {
//   const theme = useTheme();

//   return (
//     <Box sx={{ display: 'flex', px: 1, alignItems: 'center', gap: 1 }}>
//       <TextField
//         fullWidth
//         size="small"
//         placeholder="Search chats"
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon sx={{ color: 'text.secondary' }} />
//             </InputAdornment>
//           ),
//           sx: {
//             color: 'text.primary',
//             bgcolor: 'background.paper',
//             borderRadius: 10,
//             '& .MuiInputBase-input': { color: 'text.primary' },
//             '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
//             '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
//           },
//         }}
//       />
//       <IconButton
//         disableRipple
//         sx={{
//           bgcolor: 'background.paper',
//           transition: 'none',
//           '& .MuiSvgIcon-root': {
//             color: 'text.primary',
//             fill: 'text.primary',
//           },
//           '&:hover': {
//             bgcolor: 'background.paper',
//             '& .MuiSvgIcon-root': {
//               color: 'text.primary',
//               fill: 'text.primary',
//             },
//           },
//         }}
//       >
//         <CreateIcon />
//       </IconButton>
//     </Box>
//   );
// }

// SearchBar filters history and its pen icon starts a new conversation.
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField, Box, IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch, onNavigate }) {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate(`/chat/new?ts=${Date.now()}`);
    onNavigate?.();
  };

  return (
    <Box sx={{ display: 'flex', px: 1, alignItems: 'center', gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search chats"
        onChange={(e) => onSearch?.(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          sx: {
            color: 'text.primary',
            bgcolor: 'background.paper',
            borderRadius: 10,
            '& .MuiInputBase-input': { color: 'text.primary' },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
          },
        }}
      />
      {/* Pen icon → start new chat */}
      <IconButton
        onClick={handleNewChat}
        disableRipple
        sx={{
          bgcolor: 'background.paper',
          transition: 'none',
          '& .MuiSvgIcon-root': { color: 'text.primary' },
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <CreateIcon />
      </IconButton>
    </Box>
  );
}
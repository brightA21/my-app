// The composer stores the text being typed and sends it to ChatApp.
import { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import PauseIcon from '@mui/icons-material/Pause';

export default function ChatInput({ onSend, botTyping, onStopBot, hasMessages }) {
  const [inputText, setInputText] = useState('');
  const theme = useTheme();

  // Ignore blank input, then clear the field after sending.
  function sendMessage() {
    if (!inputText.trim()) return; //if the input is the empty do not send
    onSend(inputText);
    setInputText('');
  }

  // The composer stays available at the bottom while the message list scrolls.
  return (
    <Box
      // p={2}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: hasMessages ? 'auto' : '50%',
        bottom: hasMessages ? 0 : 'auto', // center if no messages
        transform: hasMessages ? 'none' : 'translateY(-50%)',
        bgcolor: theme.palette.background.default,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 1, sm: 2 },
        pb: { xs: 'max(8px, env(safe-area-inset-bottom))', sm: 1 },
      }}
    >
     <TextField
  placeholder="Send a message"
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  multiline
  maxRows={4}
  sx={{
  width: { xs: '100%', sm: 700 },
  maxWidth: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: 300,
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // removes default outline
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none', // removes hover outline
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none', // removes focus outline
    },
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
      fontSize: { xs: '16px', sm: 'inherit' },
      lineHeight: 1.45,
    },
    '& .MuiInputBase-inputMultiline': { py: { xs: 1.25, sm: 1.5 } },
    '& .MuiInputAdornment-root': { ml: 0.5 },
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!botTyping) sendMessage();
    }
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => {
            if (botTyping) onStopBot();
            else sendMessage();
          }}
          sx={{ color: theme.palette.text.primary }}
        >
          {botTyping ? <PauseIcon /> : <SendIcon />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
    </Box>
  );
}






// Three dots show that the bot request is still running.
import { Box } from '@mui/material';
import './typing.css';

export default function TypingIndicator() {
  return (
    <Box
      sx={{
        width: 50,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        ml: 1
      }}
    >
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </Box>
  );
}
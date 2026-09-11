// One message bubble. User messages align right; bot messages align left.
// ReactMarkdown turns AI markdown such as bold text and lists into formatted UI.
import { Box, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message, sender }) {
  const isUser = sender === 'user';
  const content = typeof message === 'string' ? message : String(message ?? '');

  return (
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={2}
      sx={{
        px: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        sx={{
          p: { xs: '10px 12px', sm: '12px 16px' },
          borderRadius: '5px',
          width: 'fit-content',
          maxWidth: { xs: 'calc(100vw - 28px)', sm: 400 },
          bgcolor: isUser ? '#DCF8C6' : '#FFFFFF',
          color: '#000',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
      >
        <Typography
          component="div"
          sx={{
            wordBreak: 'break-word',
            '& > *:first-of-type': { mt: 0 },
            '& > *:last-child': { mb: 0 },
            '& p': { m: 0, mb: 1, lineHeight: 1.6 },
            '& ul, & ol': { pl: 2.5, my: 1, mb: 1 },
            '& li': { mb: 0.5 },
            '& strong': { fontWeight: 700 },
            '& em': { fontStyle: 'italic' },
            '& a': {
              color: isUser ? 'text.primary' : 'primary.main',
              textDecoration: 'underline',
              wordBreak: 'break-all',
            },
            '& code': {
              bgcolor: isUser ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.04)',
              borderRadius: 1,
              px: 0.5,
              py: 0.1,
              fontFamily: 'monospace',
              fontSize: '0.9em',
            },
            '& pre': {
              overflowX: 'auto',
              bgcolor: isUser ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.04)',
              borderRadius: 1,
              p: 1,
              my: 1,
            },
            '& blockquote': {
              borderLeft: '3px solid',
              borderColor: isUser ? 'rgba(0,0,0,0.2)' : 'primary.main',
              pl: 1.5,
              ml: 0,
              my: 1,
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Typography>
      </Paper>
    </Box>
  );
}
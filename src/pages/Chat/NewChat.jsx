// A clear button for opening an empty conversation.
import { Button, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';

export default function NewChat({ onNavigate }) {
  const navigate = useNavigate();
  return (
    <Button
      startIcon={<CreateIcon />}
      onClick={() => {
        navigate(`/chat/new?ts=${Date.now()}`);
        onNavigate?.();
      }}
      sx={{
        justifyContent: 'flex-start', 
        width: '100%',               
        height: 45,
        mt: 2,
        pl: 3,
        textTransform: 'none',         
        color: 'gray',
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: '#f2f2f2',
        },
      }}
    >
      <Typography fontWeight={400}>New chat</Typography>
    </Button>
  );
}
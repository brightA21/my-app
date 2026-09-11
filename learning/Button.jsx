import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Tooltip from '@mui/material/Tooltip';


export default function ButtonUsage() {
    const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const iconLoading = () => {
    setLoading(true)
  }
  const handleClick = () => {
    alert('you clicked me');
  }

  // const iconButton = () => {
  //  setLoading(true)} 
   

  return (
  <>
     {/* <Button variant="contained">Hello world</Button> */}
     <Stack direction="column" spacing={1}>
      <Button variant="outlined"  startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button variant="contained" endIcon={<SendIcon />}>
        Send
      </Button>
      </Stack>
      
      <Stack direction="row" spacing={2}>
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="delete" disabled color="primary" size="large">
        <DeleteIcon fontSize='inherit'/>
      </IconButton>
      <IconButton color="secondary" aria-label="add an alarm">
        <AlarmIcon />
      </IconButton>
      <IconButton color="primary" aria-label="add to shopping cart">
        <AddShoppingCartIcon />
      </IconButton>
    </Stack>

    
    <Stack direction="row" spacing={3}>
      <IconButton aria-label="fingerprint" color="secondary">
        <Fingerprint onClick= {handleClick}/>
      </IconButton>
      <IconButton aria-label="fingerprint" color="success">
        <Fingerprint />
      </IconButton>
       <Tooltip title="Click to see loading">
      <IconButton onClick={iconLoading} loading={loading}>
        <ShoppingCartIcon />
      </IconButton>
    </Tooltip>
    </Stack>
     
  </>
 )  
}





  

 



  
  



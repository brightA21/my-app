// The top navigation bar opens the sidebar and holds right-side thread actions.
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import RightSideBar from './RightNav';

export default function Nav( {onMenuClick, user} ) {

return (

<Box sx={{ flexGrow: 1, }}>  
  {/* Top Nav */}  
  <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>  
    <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 }, display: "flex" }}>  
      <IconButton  
        size="large"  
        edge="start"  
        sx={{ color: 'text.primary', mr: { xs: 0.5, sm: 2 }, p: { xs: 1, sm: 1.5 } }}
        aria-label="menu"  
        onClick={onMenuClick}  
      >  
        <MenuIcon />  
      </IconButton>  
      <Typography  
        variant="h1"  
        sx={{  
          color: 'text.primary',
          fontSize: { xs: 18, sm: 20, md: 30 },  
          flexGrow: 1,
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}  
      >  
        My Chat Box  
      </Typography>

        {/* {right-side : bar}   */}
        <RightSideBar user= {user}/>
    </Toolbar>  
  </AppBar>
</Box>


);
}


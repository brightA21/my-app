// A visual separator showing that social buttons are another possible path.
import { Box, Typography} from "@mui/material";

export default function Divider() {
  return (
  <>
  <Box sx={{
    display: "flex",
    alignItems: "center",
    width: { xs: '90%', sm: '70%', md: '50%', lg:'40%', xl: '30%'},
    my: 2,
  }}>
    <Box sx={{
      flex: 1, height: 2, bgcolor: "gray"}}/> 

     <Typography sx={{mx: 2, color: "gray"}}>
      Or
     </Typography>

   <Box sx={{
      flex: 1, height: 2, bgcolor: "gray"}}/> 
  </Box>
  </>
  )
}
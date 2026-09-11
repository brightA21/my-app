// These buttons are links styled as actions for login and signup.
import { Button } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
export default function Buttons () {
  return (
 <>
<Button
        component= {RouterLink} to= '/login'
        variant="contained"
        color="success"
        sx={{ mb: 1, py: 1.5, width:
           {xs: '90%', sm: '70%', md: '50%', lg:'40%', xl: '30%'}
           }}>
        Log in
      </Button>

     <Button
         component= {RouterLink} to= '/signup'
         variant="contained"
         color="black"
         sx={{ py: 1.5, bgcolor: "white", width:
            {xs: '90%', sm: '70%', md: '50%', lg:'40%', xl: '30%'}
            }}>
         Sign up
       </Button>    
  </>    
  )
 }
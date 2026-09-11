  // LoginLink gives new users a path to the signup page.
  import { Box, Typography, Link as MuiLink} from "@mui/material";
  import {Link as RouterLink} from "react-router-dom"
  
  export default function LoginLink () {
    return(
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ color: "gray", fontSize: { xs: 12, sm: 13, md: 14 } }}>
          Don’t have an account?{" "}
          <MuiLink component={RouterLink} to= "/signup" sx={{ color: "#10a37f" }}>
            Sign Up
          </MuiLink>
        </Typography>
      </Box>
    )
  }
  

// Small legal/privacy copy shown at the bottom of the welcome screen.
import { Box, Typography, Link } from "@mui/material";

export default function Paragraph() {
  return (
     <Box sx={{ pt: 2, maxWidth: 500}}>
    <Typography
    variant="body2"
    sx={{
      color: "rgba(255,255,255,0.7)",
      textAlign: "center",
      fontSize: {
        xs: 14,
        sm: 16,
        md: 17,
      },
      lineHeight: 1.6,
    }}
  >
    By continuing, you agree to our Terms of Use
    <Box component= "span" sx={{
      display: {
        xs: "block",
        sm: "block",
        md: "inline"
      },
    }}>
    {" "} and Privacy Policy.
  </Box>
  </Typography>
  
    <Box 
    sx={{pt: 1, display: "flex", justifyContent: 
    "center", alignContent:"center"}}>
    <Link 
      href= "/terms"
      underline="always"
      color="#ccc"
      sx={{color: "#cacacaff",
      textDecorationThickness: "1px",
      textUnderlineOffset: "3px",
      }}>
        Learn how we collect and use data
      </Link>
      </Box>
  </Box>
  )
}
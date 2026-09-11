// The welcome screen is the public front door before login or signup.
import { Box, Typography, Avatar } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Divider from "./Divider";
import Buttons from "./Button";
import SocialButtons from "./SocialButtons";
import Paragraph from "./Paragraph"; 

export default function WelcomePage({ setUser }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#121212", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
   

      {/* Title */}
     <Typography
        variant="h4"
        sx={{ color: "white", fontWeight: "bold", mb: 1,
        fontSize:{xs: 20, sm: 25, md: 30, lg: 35, xl: 40}}}
      >
        Welcome to ChatGPT
      </Typography>

      {/* Subtitle */}
      <Typography sx={{ color: "gray", mb: 3, textAlign: "center" }}>
        Log in or sign up to start chatting with AI
      </Typography>

         {/* Logo */}
      <Avatar
        sx={{
          bgcolor: "green",
          width: 64,
          height: 64,
          mb: 5,
          mt: 3
        }}>

      <SmartToyIcon fontSize="large" />
      </Avatar>

      {/* Buttons */}
      <Buttons />
      <Divider />

      {/*  Social login buttons */}
      <SocialButtons setUser={setUser} />

      {/* Paragraph */}
        <Paragraph />
      </Box>
       );
}
  // SignUpHeader displays the title and instruction above account fields.
  import { Typography } from "@mui/material"
    

  export default function SignUpHeader() {
    return (
   <>
  <Typography
        variant="h4"
        sx={{
          color: "white",
          fontWeight: "bold",
          mb: 2,
          fontSize: { xs: 24, sm: 28, md: 32 },
          textAlign: "center",
        }}
      >
        Sign Up
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          color: "gray",
          mb: 4,
          textAlign: "center",
          fontSize: { xs: 14, sm: 15, md: 16 },
        }}
      >
        Create your account to start using the app
      </Typography>
      </>
    )
  };
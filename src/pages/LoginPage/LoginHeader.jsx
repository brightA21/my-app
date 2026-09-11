// LoginHeader displays the title and short instruction above the form.
import { Typography } from "@mui/material"

export default function LoginHeader () {
  return (
    <>
        <Typography
        variant="h1"
        sx={{
          color: "white",
          fontWeight: "bold",
          mb: 2,
          fontSize: { xs: 24, sm: 28, md: 32 },
          textAlign: "center",
        }}
      >
        Login
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
        Enter your account details below
      </Typography>
    </>
  )
}
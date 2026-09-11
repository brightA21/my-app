// SignUpLink sends existing users back to the login page.
import { Box, Typography, Link  } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function SignUpLink() {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ color: "gray", fontSize: { xs: 12, sm: 13, md: 14 } }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login" sx={{ color: "#10a37f" }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
}
// LoginPage arranges the heading, login form, and password-recovery links.
import { Box, Link } from "@mui/material";
import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import LoginLink from "./LoginLink";
import SocialButtons from "../WelcomePage/SocialButtons";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();

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
      <LoginHeader />

      <LoginForm setUser={setUser} />
      <SocialButtons setUser={setUser} />

      <Box sx={{ mt: 2 }}>
        <Link
          onClick={() => navigate("/forgot-password")}
          sx={{ color: "#10a37f", fontSize: { xs: 12, sm: 13, md: 14 }, cursor: "pointer" }}
        >
          Forgot your password?
        </Link>
      </Box>

      <LoginLink />
    </Box>
  );
}
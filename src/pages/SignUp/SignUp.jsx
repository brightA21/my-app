// SignUp assembles the account-creation heading, form, and login link.
import { Box } from "@mui/material";
import SignUpHeader from "./SignUpHeader";
import SignUpForm from "./SignUpForm";
import SignUpLink from "./SignUpLink";

export default function SignUp({ setUser }) {
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
      <SignUpHeader />
      <SignUpForm setUser={setUser} />
      <SignUpLink />
    </Box>
  );
}
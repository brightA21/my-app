// SignUpForm collects account details, validates the passwords, and calls signup.
import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // The backend hashes the password and returns the new logged-in user.
  const handleSignup = async (e) => {
    e.preventDefault();

    // 🔐 Password match validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("https://kiratalk-1.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message); // e.g. "User already exists"
        return;
      }

      // Save user
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      // Redirect
      navigate("/");

    } catch (error) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSignup}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", sm: "400px" },
        gap: 2,
      }}
    >
      <TextField
        label="Full Name"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        sx={{
          bgcolor: "#1e1e1e",
          input: { color: "white" },
          label: { color: "gray" },
        }}
      />

      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{
          bgcolor: "#1e1e1e",
          input: { color: "white" },
          label: { color: "gray" },
        }}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        sx={{
          bgcolor: "#1e1e1e",
          input: { color: "white" },
          label: { color: "gray" },
        }}
      />

      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        sx={{
          bgcolor: "#1e1e1e",
          input: { color: "white" },
          label: { color: "gray" },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 1, py: 1.5 }}
      >
        Sign Up
      </Button>
    </Box>
  );
}
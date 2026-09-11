// LoginForm sends credentials to the backend and gives the new user to App.
import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // The server returns a user and token; saving both keeps the session alive.
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      // Fire userChanged so ThemeContext reloads the correct theme for this user
      window.dispatchEvent(new Event("userChanged"));

      navigate("/");
    } catch (error) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", sm: "400px" },
        gap: 2,
      }}
    >
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{
          bgcolor: "#1e1e1e",
          input: { color: "white" },
          label: { color: "gray" },
          "& .MuiInputLabel-root.Mui-focused": { color: "white" },
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
          "& .MuiInputLabel-root.Mui-focused": { color: "white" },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 1, py: 1.5 }}
      >
        Login
      </Button>
    </Box>
  );
}
// ForgotPassword asks the backend to email a temporary reset link.
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Submit the email and show either the safe success message or an error.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("https://kiratalk-1.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <Typography variant="h5" sx={{ color: "white", mb: 1, fontWeight: 700 }}>
        Forgot Password
      </Typography>
      <Typography sx={{ color: "gray", mb: 3, fontSize: 14, textAlign: "center" }}>
        Enter your email and we'll send you a reset link.
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2, width: { xs: "100%", sm: "400px" } }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: { xs: "100%", sm: "400px" } }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "400px" },
          gap: 2,
        }}
      >
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
            "& .MuiInputLabel-root.Mui-focused": { color: "white" },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          disabled={loading}
          sx={{ mt: 1, py: 1.5 }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Button
          onClick={() => navigate("/login")}
          sx={{ color: "gray", textTransform: "none" }}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
}
// ResetPassword validates a new password and sends it with the URL token.
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  // The token proves that the user owns the reset link.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://kiratalk.onrender.com/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setMessage(data.message);
        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
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
        Reset Password
      </Typography>
      <Typography sx={{ color: "gray", mb: 3, fontSize: 14, textAlign: "center" }}>
        Enter your new password below.
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2, width: { xs: "100%", sm: "400px" } }}>
          {message} Redirecting to login...
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
          label="New Password"
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

        <TextField
          label="Confirm New Password"
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
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </Box>
    </Box>
  );
}
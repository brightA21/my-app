// Settings reads and updates the account profile, avatar, accent color, and theme.
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  TextField,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Popover,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import { ThemeContext } from "../theme/ThemeContext";

export default function Settings({ setUser }) {
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ _id: "", username: "", email: "", profilePic: "" });
  const [accentColor, setAccentColor] = useState("#2e7dff");
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const fileInputRef = useRef(null);

  const [appearanceAnchor, setAppearanceAnchor] = useState(null);
  const appearanceOpen = Boolean(appearanceAnchor);
  const handleAppearanceOpen = (e) => setAppearanceAnchor(e.currentTarget);
  const handleAppearanceClose = () => setAppearanceAnchor(null);

  const [accentAnchor, setAccentAnchor] = useState(null);
  const accentOpen = Boolean(accentAnchor);
  const handleAccentOpen = (e) => setAccentAnchor(e.currentTarget);
  const handleAccentClose = () => setAccentAnchor(null);

  // Load the server's current profile when this page opens.
  useEffect(() => {
    async function fetchUser() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (!storedUser?.token) return;

        const res = await axios.get("https://kiratalk-1.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${storedUser.token}` },
        });

        setProfile(res.data);
        setAccentColor(res.data.accentColor || "#2e7dff");
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, []);

  // Save edited profile data while preserving the login token in localStorage.
  const handleProfileSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!storedUser?.token) return;

      const res = await axios.patch(
        `https://kiratalk-1.onrender.com/api/user/${profile._id}`,
        { ...profile, accentColor },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );

      setProfile(res.data);
      const updatedUser = { ...storedUser, ...res.data };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("userChanged"));
      setOpenEditProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleAccentChange = async (newColor) => {
    setAccentColor(newColor);
    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      await axios.patch(
        `https://kiratalk-1.onrender.com/api/user/${profile._id}`,
        { accentColor: newColor },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );
      setUser((prev) => ({ ...prev, accentColor: newColor }));
    } catch (err) {
      console.error("Error updating accent color:", err);
    }
  };

  // Handle profile picture file selection and upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPic(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!storedUser?.token) return;

      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await axios.post(
        `https://kiratalk-1.onrender.com/api/user/${profile._id}/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state and localStorage with new profile pic URL
      setProfile((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      const updatedUser = { ...storedUser, profilePic: res.data.profilePic };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log("✅ Profile picture updated!");
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingPic(false);
      // Reset file input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const paperStyle = {
    borderRadius: 3,
    p: 2,
    mb: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 1,
    height: { xs: 52, sm: 56 },
    minHeight: { xs: 52, sm: 56 },
    width: "100%",
    boxSizing: "border-box",
    bgcolor: "white",
    color: "#000",
  };

  return (
    <Box sx={{ position: 'relative', minHeight: "100vh", px: { xs: 2, sm: 3 }, py: 2, bgcolor: "background.default" }}>
      <IconButton
        onClick={() => navigate('/chat')}
        aria-label="back"
        sx={{ position: 'absolute', left: 8, top: 8, zIndex: 10 }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box sx={{ maxWidth: { xs: "100%", sm: 760 }, mx: "auto", width: "100%" }}>
        <Box sx={{ mb: 3, pt: 1 }}>
          <Typography variant="h5" fontWeight={600} sx={{ textAlign: "center", color: "text.primary" }}>
            Settings
          </Typography>
        </Box>

        {/* Avatar + Upload Button */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{ position: "relative", display: "inline-block", overflow: "visible" }}>
            <Avatar
              src={profile.profilePic || undefined}
              sx={{ width: 80, height: 80, mx: "auto", mb: 1, bgcolor: accentColor, fontSize: 32 }}
            >
              {!profile.profilePic && profile.username?.[0]?.toUpperCase()}
            </Avatar>

            {/* Camera icon overlay */}
            <Tooltip title="Change profile picture">
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPic}
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: -8,
                  zIndex: 10,
                  boxShadow: 2,
                  bgcolor: "white",
                  color: "#000",
                  border: "2px solid #ccc",
                  width: 28,
                  height: 28,
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                {uploadingPic
                  ? <CircularProgress size={14} />
                  : <PhotoCameraIcon sx={{ fontSize: 14 }} />
                }
              </IconButton>
            </Tooltip>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
            <Typography fontWeight={600} color="text.primary">
              {profile.username}
            </Typography>
            <IconButton onClick={() => setOpenEditProfile(true)}>
              <EditIcon fontSize="small" sx={{ color: "inherit" }} />
            </IconButton>
          </Box>
        </Box>

        {/* Email */}
        <Paper sx={paperStyle}>
          <Box sx={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, mr: 1 }}>
            <EmailIcon />
          </Box>
          <Typography sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</Typography>
        </Paper>

        {/* Appearance */}
        <Paper sx={paperStyle}>
          <Box sx={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, mr: 1 }}>
            <WbSunnyIcon />
          </Box>
          <Typography sx={{ flexGrow: 1 }}>Appearance</Typography>
          <IconButton onClick={handleAppearanceOpen} sx={{ color: "inherit" }}>
            <WbSunnyIcon />
          </IconButton>

          <Popover open={appearanceOpen} anchorEl={appearanceAnchor} onClose={handleAppearanceClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
            <Box sx={{ p: 2, minWidth: { xs: 140, sm: 160 }, bgcolor: "white", color: "#000" }}>
              <RadioGroup
                value={themeMode}
                onChange={(e) => {
                  toggleTheme(e.target.value);
                  handleAppearanceClose();
                }}
              >
                <FormControlLabel value="light" control={<Radio />} label="Light" />
                <FormControlLabel value="dark" control={<Radio />} label="Dark" />
              </RadioGroup>
            </Box>
          </Popover>
        </Paper>

        {/* Accent Color */}
        <Paper sx={paperStyle}>
          <Box sx={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, mr: 1 }}>
            <ColorLensIcon />
          </Box>
          <Typography sx={{ flexGrow: 1 }}>Accent Color</Typography>
          <IconButton onClick={handleAccentOpen} sx={{ color: "inherit" }}>
            <ColorLensIcon />
          </IconButton>

          <Popover open={accentOpen} anchorEl={accentAnchor} onClose={handleAccentClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
            <Box sx={{ p: 2, minWidth: { xs: 160, sm: 180 }, bgcolor: "white", color: "#000" }}>
              <RadioGroup
                value={accentColor}
                onChange={(e) => {
                  handleAccentChange(e.target.value);
                  handleAccentClose();
                }}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <FormControlLabel value="#2e7dff" control={<Radio />} label={<Box sx={{ display: "flex", alignItems: "center" }}><Box sx={{ width: 16, height: 16, bgcolor: "#2e7dff", mr: 1, borderRadius: "50%" }} />Blue</Box>} />
                <FormControlLabel value="#ff5722" control={<Radio />} label={<Box sx={{ display: "flex", alignItems: "center" }}><Box sx={{ width: 16, height: 16, bgcolor: "#ff5722", mr: 1, borderRadius: "50%" }} />Orange</Box>} />
                <FormControlLabel value="#4caf50" control={<Radio />} label={<Box sx={{ display: "flex", alignItems: "center" }}><Box sx={{ width: 16, height: 16, bgcolor: "#4caf50", mr: 1, borderRadius: "50%" }} />Green</Box>} />
                <FormControlLabel value="#9c27b0" control={<Radio />} label={<Box sx={{ display: "flex", alignItems: "center" }}><Box sx={{ width: 16, height: 16, bgcolor: "#9c27b0", mr: 1, borderRadius: "50%" }} />Purple</Box>} />
              </RadioGroup>
            </Box>
          </Popover>
        </Paper>

        {/* Logout */}
        <Paper sx={paperStyle}>
          <ListItemButton
            onClick={() => {
              localStorage.removeItem("userInfo");
              setUser(null);
              window.dispatchEvent(new Event("userChanged"));
              window.location.href = "/login";
            }}
            sx={{ width: "100%", display: "flex", alignItems: "center" }}
          >
            <Box sx={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, mr: 1 }}>
              <LogoutIcon />
            </Box>
            <Typography>Log Out</Typography>
          </ListItemButton>
        </Paper>

        {/* Edit Profile Dialog */}
        <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Username" variant="outlined" sx={{ mb: 2 }} value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
            <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 2 }} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <Button variant="contained" fullWidth onClick={handleProfileSave}>
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
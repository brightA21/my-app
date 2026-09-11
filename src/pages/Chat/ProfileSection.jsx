// The profile row closes the drawer and opens account settings.
import React from "react";
import { Box, Avatar, Typography, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProfileSection({ user, isDark, onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof onClose === "function") onClose();
    navigate("/settings");
  };

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1, px: 1 }}
    >
      <Avatar src={user?.profilePic || undefined} sx={{ width: 40, height: 40 }}>
        {!user?.profilePic && user?.username?.[0]?.toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={600} noWrap sx={{ color: "text.primary" }}>
          {user?.username}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>
          {user?.email}
        </Typography>
      </Box>
    </ListItemButton>
  );
}
// This file gives every page one shared light/dark theme.
import React, { createContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

// Components read the current mode and call toggleTheme through this context.
export const ThemeContext = createContext();

// Helper to get the current logged-in user's ID
// Themes are saved per account, so first find the logged-in user's ID.
function getCurrentUserId() {
  try {
    const stored = localStorage.getItem("userInfo");
    if (!stored) return "guest";
    const parsed = JSON.parse(stored);
    return parsed?._id || "guest";
  } catch {
    return "guest";
  }
}

// Read the saved theme for this account; new accounts use light mode.
function getSavedTheme() {
  const userId = getCurrentUserId();
  return localStorage.getItem(`themeMode_${userId}`) || "light";
}

export const ThemeProvider = ({ children }) => {
  // Start with this account's saved preference.
  const [themeMode, setThemeMode] = useState(getSavedTheme);

  // Also reload theme whenever userInfo changes (e.g. login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setThemeMode(getSavedTheme());
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen to a custom event we'll fire on login/logout
    window.addEventListener("userChanged", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userChanged", handleStorageChange);
    };
  }, []);

  // Save the choice under the current user's ID so accounts stay separate.
  const toggleTheme = (mode) => {
    const userId = getCurrentUserId();
    setThemeMode(mode);
    localStorage.setItem(`themeMode_${userId}`, mode);
  };

  // Turn the mode into the MUI color palette used by child components.
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: themeMode,
        ...(themeMode === "dark"
          ? {
              background: { default: "#121212", paper: "rgba(0,0,0,0.6)" },
              text: { primary: "#fff", secondary: "#bdbdbd" },
            }
          : {
              background: { default: "#f5f5f5", paper: "#fff" },
              text: { primary: "#000", secondary: "#4f4f4f" },
            }),
      },
      components: {
        MuiIcon: {
          styleOverrides: {
            root: { verticalAlign: "middle" },
          },
        },
      },
    }),
    [themeMode]
  );

  // Keep body class in sync for any non-MUI styles
  useEffect(() => {
    document.body.dataset.theme = themeMode;
    document.body.style.background = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [themeMode, theme.palette.background.default, theme.palette.text.primary]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
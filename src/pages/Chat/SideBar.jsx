// import { useEffect, useState, useContext } from "react";
// import { Drawer, Box } from "@mui/material";
// import ProfileSection from "./ProfileSection";
// import ChatList from "./ChatList";
// import SearchBar from "./SearchBar";
// import NewChat from "./NewChat";

// import { ThemeContext } from "../theme/ThemeContext";

// export default function SideBar({ open, onClose }) {
//   const [user, setUser] = useState(null);
//   const { themeMode } = useContext(ThemeContext);
//   const isDark = themeMode === "dark";

//   // Fetch current user
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const storedUser = JSON.parse(localStorage.getItem("userInfo"));
//         if (!storedUser?.token) return;

//         const res = await fetch("http://localhost:5000/api/auth/me", {
//           headers: { Authorization: `Bearer ${storedUser.token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch user");

//         const data = await res.json();
//         setUser(data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     }

//     fetchUser();
//   }, []);

//   return (
//     <Drawer anchor="left" open={open} onClose={onClose}>
//       <Box
//         sx={{
//           width: 450,
//           height: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           bgcolor: "background.default",
//           color: "text.primary",
//         }}
//         role="presentation"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Top Section */}
//         <Box
//           sx={{
//             pt: 2,
//             px: 1,
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             minHeight: 0,
//           }}
//         >
//           <SearchBar />

//           <NewChat />

//           {/* Scrollable Chat List */}
//           <Box
//             sx={{
//               flex: 1,
//               overflowY: "auto",
//               minHeight: 0,

//               /* nicer scrollbar */
//               "&::-webkit-scrollbar": {
//                 width: 6,
//               },
//               "&::-webkit-scrollbar-thumb": {
//                 backgroundColor: "rgba(0,0,0,0.2)",
//                 borderRadius: 3,
//               },
//             }}
//           >
//             <ChatList />
//           </Box>
//         </Box>

//         {/* Fixed Bottom Profile */}
//         {user && (
//           <Box
//             sx={{
//               borderTop: isDark ? "none" : "1px solid #eee",
//               flexShrink: 0,
//               px: 1,
//               py: 1,
//             }}
//           >
//             <ProfileSection user={user} isDark={isDark} onClose={onClose} />
//           </Box>
//         )}
//       </Box>
//     </Drawer>
//   );
// }

// The sidebar drawer contains search, new chat, history, and the user profile.
import { useEffect, useState, useContext } from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProfileSection from "./ProfileSection";
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import NewChat from "./NewChat";
import { ThemeContext } from "../theme/ThemeContext";

export default function SideBar({ open, onClose }) {
  // Load the current account so the bottom profile row is up to date.
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  useEffect(() => {
    async function fetchUser() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (!storedUser?.token) return;
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${storedUser.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "min(88vw, 360px)", sm: 450 },
          maxWidth: "100vw",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          color: "text.primary",
        }}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ pt: { xs: 1, sm: 2 }, px: 1, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Chats
            </Typography>
            <IconButton aria-label="Close chat sidebar" onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search bar — pen icon triggers new chat, typing filters list */}
          <SearchBar onSearch={setSearchQuery} onNavigate={onClose} />

          <NewChat onNavigate={onClose} />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 3 },
            }}
          >
            {/* Pass search query to ChatList so it can filter */}
            <ChatList searchQuery={searchQuery} onNavigate={onClose} />
          </Box>
        </Box>

        {user && (
          <Box sx={{ borderTop: isDark ? "none" : "1px solid #eee", flexShrink: 0, px: 1, py: 1 }}>
            <ProfileSection user={user} isDark={isDark} onClose={onClose} />
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
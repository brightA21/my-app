// ChatList fetches the user's threads and provides open, rename, and delete actions.
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Simply cleans up the title from the backend — no overriding with generic words
function cleanTitle(title) {
  if (!title) return "New chat";
  const trimmed = title.toString().trim();
  if (!trimmed) return "New chat";
  // Truncate only if extremely long (backend already keeps it short)
  return trimmed.length > 50 ? trimmed.slice(0, 50) + "..." : trimmed;
}

export default function ChatList({ searchQuery = "", onNavigate }) {
  const [threads, setThreads] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingThread, setEditingThread] = useState(null);
  const [deletingThread, setDeletingThread] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [displayedTitles, setDisplayedTitles] = useState({});
  const touchTimeoutRef = useRef(null);
  const activeRef = useRef(null);
  const visibleThreads = threads.filter((thread) =>
    cleanTitle(thread.title).toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleDeleteThread = async () => {
    const thread = deletingThread;
    setDeletingThread(null);
    if (!thread) return;

    try {
      const stored = JSON.parse(localStorage.getItem("userInfo"));
      if (!stored?.token) return;
      const res = await fetch(`https://kiratalk-1.onrender.com/api/messages/threads/${thread._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${stored.token}` },
      });
      if (res.ok) {
        setThreads((prev) => prev.filter((t) => t._id !== thread._id));
        if (location.pathname === `/chat/${thread._id}` || location.pathname === "/chat") {
          window.dispatchEvent(new Event("clearChat"));
          navigate("/chat/new");
        }
        window.dispatchEvent(new Event("threadsUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- FETCH THREADS ---------------- */
  useEffect(() => {
    async function fetchThreads() {
      try {
        const stored = JSON.parse(localStorage.getItem("userInfo"));
        if (!stored?.token) return;

        const res = await fetch("https://kiratalk-1.onrender.com/api/messages/threads", {
          headers: { Authorization: `Bearer ${stored.token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        setThreads(data);

        // Use the title exactly as the backend stored it (OpenAI-generated or fallback)
        const map = {};
        (data || []).forEach((t) => {
          map[t._id] = cleanTitle(t.title);
        });
        setDisplayedTitles(map);
      } catch (err) {
        console.error(err);
      }
    }

    fetchThreads();
    const onUpdate = () => fetchThreads();
    window.addEventListener("threadsUpdated", onUpdate);
    return () => window.removeEventListener("threadsUpdated", onUpdate);
  }, []);

  /* -------- AUTO SCROLL TO ACTIVE THREAD -------- */
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flexGrow: 1,
        overflow: "hidden",
      }}
    >
      {/* Header (fixed) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          flexShrink: 0,
          backgroundColor: "background.paper",
          zIndex: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Chat history
        </Typography>
        <IconButton size="small" onClick={() => setHistoryOpen((v) => !v)}>
          {historyOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Scrollable chat list */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {threads.length === 0 ? (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography color="text.secondary">No chats yet</Typography>
          </Box>
        ) : (
          <List
            sx={{
              m: 0,
              p: 0,
              minHeight: 0,
              touchAction: "pan-y",
              overscrollBehavior: "contain",
            }}
          >
            {historyOpen &&
              visibleThreads.map((thread) => {
                const isActive = location.pathname === `/chat/${thread._id}`;
                return (
                  <ListItem
                    key={thread._id}
                    disablePadding
                    ref={isActive ? activeRef : null}
                  >
                    <ListItemButton
                      selected={isActive}
                      onClick={() => {
                        navigate(`/chat/${thread._id}`);
                        onNavigate?.();
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          mouseX: e.clientX,
                          mouseY: e.clientY,
                          thread,
                        });
                      }}
                      onTouchStart={(e) => {
                        const touch = e.touches?.[0];
                        touchTimeoutRef.current = setTimeout(() => {
                          if (touch)
                            setContextMenu({
                              mouseX: touch.clientX,
                              mouseY: touch.clientY,
                              thread,
                            });
                        }, 600);
                      }}
                      onTouchEnd={() => {
                        if (touchTimeoutRef.current) {
                          clearTimeout(touchTimeoutRef.current);
                          touchTimeoutRef.current = null;
                        }
                      }}
                      onTouchMove={() => {
                        if (touchTimeoutRef.current) {
                          clearTimeout(touchTimeoutRef.current);
                          touchTimeoutRef.current = null;
                        }
                      }}
                      sx={{
                        mx: 1,
                        borderRadius: 2,
                        transition: "all .2s",
                        "&.Mui-selected": {
                          backgroundColor: "action.selected",
                          fontWeight: 600,
                        },
                        "&:hover": {
                          backgroundColor: "action.hover",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      {/* Use displayedTitles which reflects the backend OpenAI-generated title */}
                      <ListItemText
                        primary={displayedTitles[thread._id] || "New chat"}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        open={Boolean(contextMenu)}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            const thread = contextMenu?.thread;
            setContextMenu(null);
            if (!thread) return;
            setEditingThread(thread);
            setEditValue(thread.title || "");
          }}
        >
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={async () => {
            const thread = contextMenu?.thread;
            setContextMenu(null);
            if (!thread) return;
            setDeletingThread(thread);
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={Boolean(deletingThread)} onClose={() => setDeletingThread(null)}>
        <DialogTitle>Delete chat thread?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This will permanently delete {deletingThread?.title || "this conversation"}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingThread(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteThread}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingThread)} onClose={() => setEditingThread(null)}>
        <DialogTitle>Edit thread title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter thread title"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingThread(null)}>Cancel</Button>
          <Button
            onClick={async () => {
              const thread = editingThread;
              setEditingThread(null);
              if (!thread) return;
              try {
                const stored = JSON.parse(localStorage.getItem("userInfo"));
                if (!stored?.token) return;
                const res = await fetch(
                  `https://kiratalk-1.onrender.com/api/messages/threads/${thread._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${stored.token}`,
                    },
                    body: JSON.stringify({ title: editValue }),
                  }
                );
                if (res.ok) {
                  const newTitle = editValue || "New chat";
                  // Animate the new title typing in character by character
                  setDisplayedTitles((prev) => ({ ...prev, [thread._id]: "" }));
                  let i = 0;
                  const timer = setInterval(() => {
                    i += 1;
                    setDisplayedTitles((prev) => ({
                      ...prev,
                      [thread._id]: newTitle.slice(0, i),
                    }));
                    if (i >= newTitle.length) {
                      clearInterval(timer);
                      window.dispatchEvent(new Event("threadsUpdated"));
                    }
                  }, 40);
                }
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
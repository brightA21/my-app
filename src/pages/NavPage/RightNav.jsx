// import  { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {Box} from '@mui/material'
// import CreateIcon from '@mui/icons-material/Create';
// import DotDropDown from './DotDropDown';
// import AccountCircleicon from '@mui/icons-material/AccountCircle';
// import { IconButton } from '@mui/material';
 
//  export default function RightSideBar ({user}) {
//  const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();

//   // Close dropdown if clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handlers for internal actions
//   const handleProfileClick = () => {
//     navigate('/welcome'); // navigate to Welcome/Login page
//   };

//   const handleNewChat = () => {
//     console.log('Start new chat'); // TODO: replace with backend API call
//   };

//   const handleDelete = () => {
//     console.log('Delete chat'); // TODO: replace with backend API call
//   };

//   const handleRename = () => {
//     console.log('Rename chat'); // TODO: replace with backend API call
//   };





//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

//             {/* Profile icon shows only if NOT logged in */}
//             {!user && (
//               <IconButton
//                 sx={{ width: 36, height: 36, cursor: 'pointer' }}
//                 onClick={handleProfileClick}
//               >
//                 <AccountCircleicon />
//               </IconButton>
//             )}

//             {/* New Chat icon */}
//             <IconButton color="black" onClick={handleNewChat}>
//               <CreateIcon />
//             </IconButton>

//             {/* Dot icon with dropdown */}
//            <DotDropDown  dropdownOpen= {dropdownOpen} 
//            setDropdownOpen= { setDropdownOpen }
//            dropdownRef= {dropdownRef}
//            handleDelete= {handleDelete}
//           handleRename= {handleRename}
          
          
//           />
//           </Box> 
//   )
//  }
 


// RightNav contains new-chat, rename, delete, and the active-thread menu.
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DotDropDown from './DotDropDown';
import AccountCircleicon from '@mui/icons-material/AccountCircle';

export default function RightSideBar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeThread, setActiveThread] = useState(null); // { _id, title }
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // ChatApp broadcasts the selected thread so this menu knows what to edit.
  useEffect(() => {
    const handler = (e) => setActiveThread(e.detail);
    window.addEventListener('activeThreadChanged', handler);
    return () => window.removeEventListener('activeThreadChanged', handler);
  }, []);

  // Clear active thread when navigating to /chat/new or /chat
  useEffect(() => {
    if (location.pathname === '/chat' || location.pathname === '/chat/new') {
      setActiveThread(null);
    }
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewChat = () => {
    navigate(`/chat/new?ts=${Date.now()}`);
  };

  const handleDelete = async () => {
    if (!activeThread) return;
    try {
      const stored = JSON.parse(localStorage.getItem('userInfo'));
      if (!stored?.token) return;
      const res = await fetch(
        `https://kiratalk-1.onrender.com/api/messages/threads/${activeThread._id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${stored.token}` } }
      );
      if (res.ok) {
        setActiveThread(null);
        window.dispatchEvent(new Event('threadsUpdated'));
        navigate('/chat/new');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleRename = () => {
    if (!activeThread) return;
    setRenameValue(activeThread.title || '');
    setRenameOpen(true);
  };

  const handleRenameSave = async () => {
    if (!activeThread) return;
    try {
      const stored = JSON.parse(localStorage.getItem('userInfo'));
      if (!stored?.token) return;
      const res = await fetch(
        `https://kiratalk-1.onrender.com/api/messages/threads/${activeThread._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${stored.token}` },
          body: JSON.stringify({ title: renameValue }),
        }
      );
      if (res.ok) {
        setActiveThread((prev) => ({ ...prev, title: renameValue }));
        window.dispatchEvent(new Event('threadsUpdated'));
      }
    } catch (err) {
      console.error('Rename failed:', err);
    } finally {
      setRenameOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {!user && (
        <IconButton sx={{ width: 36, height: 36, cursor: 'pointer' }} onClick={() => navigate('/welcome')}>
          <AccountCircleicon />
        </IconButton>
      )}

      {/* New Chat icon */}
      <IconButton sx={{ color: 'text.primary' }} onClick={handleNewChat}>
        <CreateIcon />
      </IconButton>

      {/* Three dot dropdown */}
      <DotDropDown
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
        handleDelete={() => setDeleteOpen(true)}
        handleRename={handleRename}
        activeThread={activeThread}
      />

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)}>
        <DialogTitle>Rename chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Enter new name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRenameSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete chat thread?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This will permanently delete {activeThread?.title || 'this conversation'}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => { setDeleteOpen(false); handleDelete(); }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
// import {  Box, Typography, Avatar, IconButton, Paper } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import Delete from './Delete';
// import Rename from './Rename';

//  export default function DotDropDown ({ dropdownOpen,dropdownRef, 
// setDropdownOpen, 
// handleDelete,
// handleRename}) {
//   return (
//   <Box sx={{ position: 'relative' }} ref={dropdownRef}>
//               <IconButton color="black" onClick={() => setDropdownOpen(!dropdownOpen)}>
//                 <MoreVertIcon />
//               </IconButton>

//               {dropdownOpen && (
//                 <Paper
//                   sx={{
//                     position: 'absolute',
//                     top: '100%',
//                     right: 0,
//                     mt: 1,
//                     bgcolor: 'white',
//                     borderRadius: 2,
//                     minWidth: 180,
//                     boxShadow: 3,
//                     zIndex: 10,
//                   }}
//                 >
//                   {/* Chat title */}
//                   <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee' }}>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
//                       {'No Chat Selected'}
//                     </Typography>
//                   </Box>

//                   {/* Delete */}
//                   <Delete  setDropdownOpen= {setDropdownOpen}
//                    handleDelete= { handleDelete }
//                   />

//                   {/* Rename */}
//                 <Rename setDropdownOpen= {setDropdownOpen}
//                  handleRename= {handleRename}
//                 />
//                 </Paper>
//               )}
//             </Box>
//   )
//  }
 
 

// The three-dot menu groups actions for the currently selected thread.
import { Box, Typography, IconButton, Paper } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Delete from './Delete';
import Rename from './Rename';

export default function DotDropDown({ dropdownOpen, dropdownRef, setDropdownOpen, handleDelete, handleRename, activeThread }) {
  return (
    <Box sx={{ position: 'relative' }} ref={dropdownRef}>
      <IconButton sx={{ color: 'text.primary' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <MoreVertIcon />
      </IconButton>

      {dropdownOpen && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            minWidth: 200,
            boxShadow: 3,
            zIndex: 10,
          }}
        >
          {/* Show active thread title or fallback */}
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 180,
                color: 'text.primary',
              }}
            >
              {activeThread?.title || 'No Chat Selected'}
            </Typography>
          </Box>

          <Delete setDropdownOpen={setDropdownOpen} handleDelete={handleDelete} disabled={!activeThread} />
          <Rename setDropdownOpen={setDropdownOpen} handleRename={handleRename} disabled={!activeThread} />
        </Paper>
      )}
    </Box>
  );
}
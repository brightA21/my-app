// GoogleLogin opens Google's popup and returns a short-lived Google ID token.
import { GoogleLogin } from '@react-oauth/google';
import IconButton from '@mui/material/IconButton';
import AppleIcon from '../../../public/icons8-apple-200.png'
import { Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
  
export default function SocialButtons({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Send Google's token to our backend; our backend verifies it and returns
  // the same application JWT used by normal email/password login.
  const handleGoogleSuccess = async ({ credential }) => {
    setError('');
    try {
      const response = await fetch('https://kiratalk.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Google login failed');

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      window.dispatchEvent(new Event('userChanged'));
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box sx={{ mt: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google login was cancelled or failed')}
          useOneTap={false}
        />
        {/* Apple remains visual-only until Apple OAuth credentials are configured. */}
            <IconButton
            size="large"
            edge="start"
            aria-label="Apple login unavailable"
            sx={{ mr: 2, bgcolor: "white"}}>
           <Box component={"img"} 
            src={AppleIcon}
            alt="icon" 
            sx={{ width: {xs: 20, sm: 28, md:36},
            height: 'auto',
          }}
            />
         </IconButton>
      </Box>
    </>
  )
}
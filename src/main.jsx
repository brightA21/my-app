// main.jsx starts the React app, loads fonts, and enables browser routing.
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom' 
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '833058213940-1lq04vk7h08foutneucofsd90870vs5a.apps.googleusercontent.com';

// Put the React component tree inside the root element from index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Router lets pages change the URL without reloading the browser. */}
    <Router>
      {/* GoogleOAuthProvider gives GoogleLogin access to the public Client ID. */}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Router>
  </StrictMode>,
)

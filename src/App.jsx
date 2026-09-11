// App.css contains styles that can be shared by the whole application.
import './App.css'
// useState lets this component remember values that can change while the app runs.
import { useState } from 'react'
// Routes chooses which screen to show. Route describes one URL.
// Navigate sends the user to a different URL without a full page refresh.
import { Routes, Route, Navigate } from "react-router-dom"

// These are the screens and shared pieces used by the routes below.
import WelcomePage from './pages/WelcomePage/WelcomePage'
import LoginPage from './pages/LoginPage/Login'
import SignUp from './pages/SignUp/SignUp'
import Nav from './pages/NavPage/AppBar'
import SideBar from './pages/Chat/SideBar'
import ChatApp from './pages/ChatMessages/ChatApp'
import Settings from './pages/settings/Settings'
import ForgotPassword from './pages/passwordreset/ForgotPassword'
import ResetPassword from './pages/passwordreset/ResetPassword'
import { ThemeProvider } from './pages/theme/ThemeContext'

function App() {
  // This remembers whether the mobile/desktop sidebar is open.
  // false means hidden; true means visible.
  const [open, setOpen] = useState(false);

  // This is the app's simple login memory.
  // When the browser opens, look for the user saved during login.
  // If userInfo exists, the user is treated as logged in.
  // If it does not exist, the user is treated as logged out.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    // ThemeProvider gives every screen access to light/dark mode colors.
    <ThemeProvider>
    {/* // Routes is the traffic controller for the frontend. */}
    <Routes>

      {/*
        The root URL is only a starting point.
        Logged-in users go to the chat.
        Logged-out users go to the login screen.
      */}
      <Route
        path="/"
        element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />}
      />

      {/*
        This is a protected route.
        The question is: "Do we have a user?"
        - Yes: show the navigation bar, sidebar, and chat.
        - No: show no private content and send the person to login.
      */}
      <Route
        path="/chat"
        element={
          user ? (
            <>
              {/* The top bar can open the sidebar. */}
              <Nav onMenuClick={() => setOpen(true)} user={user} />
              {/* The sidebar receives its open/close instructions from App. */}
              <SideBar
                open={open}
                onClose={() => setOpen(false)}
                user={user}
              />
              {/* This is where messages, the input, and AI replies appear. */}
              <ChatApp />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/*
        This is the same protected chat layout, but with a thread ID.
        For example, /chat/123 means "open thread 123".
        ChatApp reads the ID and loads that conversation from the backend.
      */}
      <Route
        path="/chat/:id"
        element={
          user ? (
            <>
              <Nav onMenuClick={() => setOpen(true)} user={user} />
              <SideBar
                open={open}
                onClose={() => setOpen(false)}
                user={user}
              />
              <ChatApp />
            </>
          ) : (
            // A person cannot open a thread URL unless they are logged in.
            <Navigate to="/login" />
          )
        }
      />

      {/* These routes are public, so visitors can use them without logging in. */}
      <Route path="/welcome" element={<WelcomePage setUser={setUser} />} />
      {/* Login and signup receive setUser so they can tell App about a new login. */}
      <Route path="/signup" element={<SignUp setUser={setUser} />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      {/* Password recovery pages are also public. */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/*
        Settings is another protected route.
        Only a logged-in user can view or change account settings.
      */}
      <Route
        path="/settings"
        element={
          user ? (
            <Settings user={user} setUser={setUser} />
          ) : (
            // If someone types /settings while logged out, send them to login.
            <Navigate to="/login" />
          )
        }
      />

    </Routes>
    {/* Close the ThemeProvider after all routes have received its theme. */}
    </ThemeProvider>
  );
}

// main.jsx renders this component into the HTML element with id="root".
export default App;
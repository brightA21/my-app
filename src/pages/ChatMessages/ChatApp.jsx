// ChatApp controls the conversation: it loads threads, saves messages, asks the
// backend for replies, displays them, and keeps the newest message visible.


import { useEffect, useRef, useState, createRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Fab } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './chatApp.css';
import TypingIndicator from './TypingIndicator';

export default function ChatApp() {
  const [chatMessages, setChatMessages] = useState([]);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [abortController, setAbortController] = useState(null);

  const messagesRef = useRef(null);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const activeThreadIdRef = useRef(null);
  const messageRefs = useRef([]);

  // Keep ref in sync so async functions always see latest threadId
  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
  }, [activeThreadId]);

  const scrollToLatestMessage = () => {
    const lastRef = messageRefs.current[messageRefs.current.length - 1];
    if (lastRef) {
      lastRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScroll = () => {
    const el = messagesRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setShowScrollDown(!isAtBottom);
  };

  const clearExpiredSession = () => {
    localStorage.removeItem('userInfo');
    window.dispatchEvent(new Event('userChanged'));
    setChatMessages([]);
    setActiveThreadId(null);
    activeThreadIdRef.current = null;
    setBotTyping(false);
    window.location.href = '/login';
  };

  const getStoredUser = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('userInfo'));
      if (!stored?.token) return null;

      const payload = JSON.parse(window.atob(stored.token.split('.')[1]));
      if (!payload.exp || payload.exp * 1000 <= Date.now()) {
        clearExpiredSession();
        return null;
      }

      return stored;
    } catch {
      clearExpiredSession();
      return null;
    }
  };

  const getResponseError = async (response, fallback) => {
    try {
      const data = await response.json();
      return data?.message || data?.error || fallback;
    } catch {
      return fallback;
    }
  };

  const handleSend = async (text) => {
    const userMessage = { id: crypto.randomUUID(), sender: 'user', message: text };
    setChatMessages((prev) => [...prev, userMessage]);
    setBotTyping(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const stored = getStoredUser();
      if (!stored?.token) {
        throw new Error('Session expired. Please log in again.');
      }

      let threadId = activeThreadIdRef.current;

      if (!threadId) {
        // New thread — create it (backend generates AI title)
        const res = await fetch('https://kiratalk-1.onrender.com/api/messages/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${stored.token}` },
          body: JSON.stringify({ message: text }),
          signal: controller.signal,
        });

        if (!res.ok) {
          if (res.status === 401) clearExpiredSession();
          throw new Error(await getResponseError(res, 'Failed to create thread'));
        }
        const data = await res.json();
        threadId = data._id;
        setActiveThreadId(threadId);
        activeThreadIdRef.current = threadId;
        window.dispatchEvent(new Event('threadsUpdated'));
        // Broadcast new thread to navbar
        window.dispatchEvent(new CustomEvent('activeThreadChanged', { detail: { _id: data._id, title: data.title } }));
      } else {
        // Existing thread — save user message
        const saveRes = await fetch(`https://kiratalk-1.onrender.com/api/messages/threads/${threadId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${stored.token}` },
          body: JSON.stringify({ sender: 'user', text }),
          signal: controller.signal,
        });
        if (!saveRes.ok) {
          if (saveRes.status === 401) clearExpiredSession();
          throw new Error(await getResponseError(saveRes, 'Failed to save message'));
        }
      }

      // Get real AI reply from Groq via backend
      const replyRes = await fetch(
        `https://kiratalk-1.onrender.com/api/messages/threads/${threadId}/ai-reply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${stored.token}` },
          signal: controller.signal,
        }
      );

      if (!replyRes.ok) {
        if (replyRes.status === 401) {
          clearExpiredSession();
        }
        throw new Error(await getResponseError(replyRes, 'AI reply failed'));
      }
      const replyData = await replyRes.json();

      const botMessage = { id: crypto.randomUUID(), sender: 'robot', message: replyData.reply };
      setChatMessages((prev) => [...prev, botMessage]);
      window.dispatchEvent(new Event('threadsUpdated'));

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('Chat error:', err);
        const errorMessage = {
          id: crypto.randomUUID(),
          sender: 'robot',
          message: `Sorry, something went wrong: ${err.message || 'Please try again.'}`,
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setBotTyping(false);
      setAbortController(null);
    }
  };

  const stopBot = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setBotTyping(false);
  };

  useEffect(() => {
    messageRefs.current = chatMessages.map((_, i) => messageRefs.current[i] || createRef());
    scrollToLatestMessage();
  }, [chatMessages]);

  const loadThread = async (threadId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('userInfo'));
      if (!stored?.token) return;
      const res = await fetch(`https://kiratalk-1.onrender.com/api/messages/threads/${threadId}`, {
        headers: { Authorization: `Bearer ${stored.token}` },
      });
      if (!res.ok) return;
      const thread = await res.json();
      const msgs = (thread.messages || []).map((m) => ({
        id: crypto.randomUUID(),
        sender: m.sender === 'user' ? 'user' : 'robot',
        message: m.text,
      }));
      setChatMessages(msgs);
      setActiveThreadId(threadId);
      // Broadcast active thread to navbar so it can show title + delete/rename
      window.dispatchEvent(new CustomEvent('activeThreadChanged', { detail: { _id: thread._id, title: thread.title } }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const onOpen = (e) => {
      const id = e?.detail?.threadId;
      if (id) loadThread(id);
    };
    window.addEventListener('openThread', onOpen);
    return () => window.removeEventListener('openThread', onOpen);
  }, []);

  useEffect(() => {
    const onClear = () => {
      setChatMessages([]);
      setActiveThreadId(null);
    };
    window.addEventListener('clearChat', onClear);
    return () => window.removeEventListener('clearChat', onClear);
  }, []);

  const params = useParams();
  const location = useLocation();
  useEffect(() => {
    const id = params?.id;
    if (!id || id === 'new') {
      setChatMessages([]);
      setActiveThreadId(null);
      activeThreadIdRef.current = null;
      window.dispatchEvent(new CustomEvent('activeThreadChanged', { detail: null }));
      setShowScrollDown(false);
      setBotTyping(false);
      messageRefs.current = [];
      if (messagesRef.current) messagesRef.current.scrollTo({ top: 0 });
      return;
    }
    if (id) loadThread(id);
  }, [params?.id, location.search]);

  return (
    <Box
      sx={{
        height: { xs: 'calc(100dvh - 56px)', sm: 'calc(100dvh - 64px)' },
        width: '100%',
        maxWidth: 850,
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        minWidth: 0,
      }}
    >
      <Box
        ref={messagesRef}
        onScroll={handleScroll}
        className="hide-scrollbar"
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          bgcolor: 'transparent',
          overflowY: 'auto',
          overflowX: 'hidden',
          pt: { xs: 1, sm: 2 },
          pb: { xs: '112px', sm: '120px' },
          px: { xs: 0.5, sm: 2 },
        }}
      >
        {chatMessages.map((msg, index) => (
          <Box key={msg.id} ref={(el) => (messageRefs.current[index] = el)}>
            <ChatMessage message={msg.message} sender={msg.sender} />
          </Box>
        ))}

        {botTyping && (
          <Box mb={2}>
            <TypingIndicator />
          </Box>
        )}
      </Box>

      {showScrollDown && (
        <Fab
          size="small"
          onClick={() => {
            if (messagesRef.current) {
              messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
            }
          }}
          sx={{ position: 'fixed', bottom: 90, right: 20 }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}

      <ChatInput onSend={handleSend} botTyping={botTyping} onStopBot={stopBot} hasMessages={chatMessages.length > 0} />
    </Box>
  );
}
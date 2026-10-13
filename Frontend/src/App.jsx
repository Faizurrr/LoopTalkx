import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import RegisterPage from "./Pages/register";
import LoginPage from "./Pages/login";
import ProfilePage from "./Pages/Profile";
import OnBoardingPage from "./Pages/OnBoardingPage";
import { isAuthenticated } from "./Helper/Auth.jsx";
import { isOnboarded } from "./Helper/Onboard.jsx";
import Notifications from "./Pages/Notifications.jsx";
import Friends from "./Pages/Friends.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import ChatPage from "./Pages/ChatPage.jsx";
import CallPage from "./Pages/CallPage.jsx";
import About from "./Pages/About.jsx";
import Docs from "./Pages/Docs.jsx";
import Privacy from "./Pages/Privacy.jsx";
import Terms from "./Pages/Terms.jsx";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatNotificationProvider } from "./context/ChatNotificationContext";
import { Toaster } from "react-hot-toast";

// needs login + onboarding done
function ProtectedRoute({ children, showNavbar = true }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isOnboarded()) return <Navigate to="/onBoarding" replace />;

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}

// onboarding page, only login needed
function OnboardingRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

// login/register, only for logged out users
function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return isOnboarded() ? <Navigate to="/" replace /> : <Navigate to="/onBoarding" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const [authState, setAuthState] = useState(0);

  // re-render when login/logout happens
  useEffect(() => {
    const handleAuthChange = () => setAuthState((prev) => prev + 1);

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const canPoll = isAuthenticated() && isOnboarded();

  // provider is outside Routes because Routes key changes on every page
  return (
    <NotificationProvider enabled={canPoll}>
      <ChatNotificationProvider enabled={canPoll}>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes key={`${location.pathname}-${authState}`}>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/Profile" element={<Navigate to="/profile" replace />} />

          <Route path="/notification" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/notifications" element={<Navigate to="/notification" replace />} />

          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />

          {/* chat and call pages have no navbar */}
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute showNavbar={false}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/call/:id"
            element={
              <ProtectedRoute showNavbar={false} >
                <CallPage />
              </ProtectedRoute>
            }
          />

          <Route path="/onBoarding" element={<OnboardingRoute><OnBoardingPage /></OnboardingRoute>} />
          <Route path="/onboarding" element={<Navigate to="/onBoarding" replace />} />

          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

          {/* public pages */}
          <Route path="/about" element={<><Navbar /><About /></>} />
          <Route path="/docs" element={<><Navbar /><Docs /></>} />
          <Route path="/privacy" element={<><Navbar /><Privacy /></>} />
          <Route path="/terms" element={<><Navbar /><Terms /></>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ChatNotificationProvider>
    </NotificationProvider>
  );
}

function App() {
  const { theme } = useThemeStore(); // get the current theme from Zustand store

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-200" data-theme={theme}>
      <BrowserRouter>
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
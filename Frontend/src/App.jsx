   // import all required page ... 
import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate, useLocation } from "react-router-dom";
import Home from './Pages/Home';
import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import RegisterPage from "./Pages/register";
import LoginPage from "./Pages/login";
import ProfilePage from "./Pages/Profile";
import OnBoardingPage from "./Pages/OnBoardingPage";
import { isAuthenticated } from "./Helper/Auth.jsx";
import { isOnboarded } from "./Helper/Onboard.jsx";
import Notifications from "./Pages/Notifications.jsx";
import Friends from "./Pages/Friends.jsx" ;
import { useThemeStore } from "./store/useThemeStore.js";
import ChatPage from "./Pages/ChatPage.jsx";
import CallPage from "./Pages/CallPage.jsx";
import About from "./Pages/About.jsx";
import Docs from "./Pages/Docs.jsx";
import Privacy from "./Pages/Privacy.jsx";
import Terms from "./Pages/Terms.jsx";
   // logic of conditional routing..

// Route guard for pages requiring login AND completed onboarding (Home, Profile, etc.)
function ProtectedRoute({ children ,  showNavbar = true }) {
  const authenticated = isAuthenticated();
  const onboarded = isOnboarded();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!onboarded) {
    return <Navigate to="/onBoarding" replace />;
  }

  return (
    <>
        {showNavbar && <Navbar />}
      {children}
    </>
  );
}

// Route guard for onboarding page / profile editing (requires authentication)
function OnboardingRoute({ children }) {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Route guard for login/register pages (only accessible when NOT logged in)
function PublicOnlyRoute({ children }) {
  const authenticated = isAuthenticated();
  const onboarded = isOnboarded();

  if (authenticated) {
    return onboarded ? <Navigate to="/" replace /> : <Navigate to="/onBoarding" replace />;
  }

  return children;
}

function AppRoutes() {
  const location = useLocation();
  const [authState, setAuthState] = useState(0);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState((prev) => prev + 1);
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return (
    <Routes key={`${location.pathname}-${authState}`}>
      {/* Home: authenticated + onboarded */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Profile: authenticated + onboarded */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/Profile" element={<Navigate to="/profile" replace />} />



      <Route
        path="/notification"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route path="/notifications" element={<Navigate to="/notification" replace />} />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        }
      />
         // protected Chat page....
             <Route
        path="/chat/:id"
        element={
          <ProtectedRoute showNavbar={false}>
            <ChatPage />
          </ProtectedRoute>
        }
      />
       // protected call page
       <Route
        path="/call/:id"
        element={
          <ProtectedRoute showNavbar={false}>
            <CallPage />
          </ProtectedRoute>
        }
      />



      {/* Onboarding: authenticated + not onboarded */}
      <Route
        path="/onBoarding"
        element={
          <OnboardingRoute>
            <OnBoardingPage />
          </OnboardingRoute>
        }
      />
      <Route path="/onboarding" element={<Navigate to="/onBoarding" replace />} />

      {/* Login: unauthenticated only */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* Register: unauthenticated only */}
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* Public info pages */}
      <Route path="/about" element={<><Navbar /><About /></>} />
      <Route path="/docs" element={<><Navbar /><Docs /></>} />
      <Route path="/privacy" element={<><Navbar /><Privacy /></>} />
      <Route path="/terms" element={<><Navbar /><Terms /></>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const { theme } = useThemeStore();

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
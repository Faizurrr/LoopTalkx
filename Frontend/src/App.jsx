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

// Route guard for pages requiring login AND completed onboarding (Home, Profile, etc.)
function ProtectedRoute({ children }) {
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
      <Navbar />
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

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
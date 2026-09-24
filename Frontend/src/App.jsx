import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import RegisterPage from "./Pages/register";

import LoginPage from "./Pages/login";
import ProfilePage from "./Pages/Profile";
import OnBoardingPage from "./Pages/OnBoardingPage";

import { isAuthenticated } from "./Helper/Auth.jsx";
import { isOnboarded } from "./Helper/Onboard.jsx";

function App() {
  const authenticated = isAuthenticated();
  const onboarded = isOnboarded();

  return (
    <BrowserRouter>
      {authenticated && onboarded && <Navbar />}

      <Routes>
        {/* Home: only for authenticated + onboarded users */}
        <Route
          path="/"
          element={
            authenticated && onboarded
              ? <h1>hello</h1>
              : !authenticated
                ? <Navigate to="/login" replace />
                : <Navigate to="/onBoarding" replace />
          }
        />

        {/* Profile: requires authentication */}
        <Route
          path="/Profile"
          element={
            authenticated
              ? <ProfilePage />
              : <Navigate to="/login" replace />
          }
        />

        {/* Onboarding: for authenticated but not-onboarded users */}
        <Route
          path="/onBoarding"
          element={
            !authenticated
              ? <Navigate to="/login" replace />
              : onboarded
                ? <Navigate to="/" replace />
                : <OnBoardingPage />
          }
        />

        {/* Login: only for unauthenticated users */}
        <Route
          path="/login"
          element={
            !authenticated
              ? <LoginPage />
              : <Navigate to="/" replace />
          }
        />

        {/* Register: only for unauthenticated users */}
        <Route
          path="/register"
          element={
            !authenticated
              ? <RegisterPage />
              : <Navigate to="/" replace />
          }
        />
      </Routes>

      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
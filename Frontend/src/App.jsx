import { Routes, Route, BrowserRouter } from "react-router-dom";

import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import RegisterPage from "./Pages/register";
import LoginPage from "./Pages/login";
import ProfilePage from "./Pages/Profile";
import OnBoardingPage from "./Pages/OnBoardingPage";

function App() {  
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>hello</h1>} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/onBoarding" element={<OnBoardingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
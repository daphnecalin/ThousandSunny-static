import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import Navbar from "./components/navBar";
import ProfilePage from "./pages/profilePage";
import Portfolio from "./pages/portfolio";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";
import Library from "./pages/library";
import Login from "./pages/login";
import Register from "./pages/register";
import ProfileSettings from "./pages/profileSettings"
import ProfilePage from "./pages/profilePage"
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 px-6 h-screen w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:username" element={<ProfilePage />} />

          {/* Consumer-only pages */}
          <Route path="/library" element={<Library />} />

          {/* Artist-only pages */}
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profileSettings" element={<ProfileSettings />} />
          <Route path = "/profilePage/:username" element={<ProfilePage />}/>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

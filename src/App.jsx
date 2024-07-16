import HomePage from "./pages/home/HomePage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* common components */}
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
}

export default App;

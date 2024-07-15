import HomePage from "./pages/home/HomePage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;

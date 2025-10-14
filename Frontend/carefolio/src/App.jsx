import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import MealSurvey from "./pages/Dashboard/components/MealSurvey";
import WorkoutPlan from "./pages/Dashboard/components/WorkoutSurvey"; // ✅ new page

function App() {
  return (
    <Router>
      {/* Top Navbar visible on all pages */}
      <AppNavbar />

      {/* Main page container (add top margin for fixed navbar space) */}
      <div style={{ marginTop: "80px" }}>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Surveys */}
          <Route path="/meal" element={<MealSurvey />} />
          <Route path="/workoutplan" element={<WorkoutPlan />} />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <h2
                className="text-center mt-5"
                style={{ color: "#999", fontFamily: "Poppins" }}
              >
                404 - Page Not Found
              </h2>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

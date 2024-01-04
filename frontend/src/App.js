import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage'; // Import the RegistrationPage component
import Dashboard from './DashBoard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  const handleLogIn = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  }

  const handleLogOut = () => {
    setIsLoggedIn(false);
  }

  return (
    <Router>
      <Routes>
        {/* Redirect to Dashboard if the user is logged in */}
        <Route 
          path="/"
          element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <LoginPage onLogin={handleLogIn} />}
        />
        {/* Registration Route */}
        <Route path="/register" element={<RegistrationPage />} />
        {/* Dashboard Route */}
        <Route 
          path="/dashboard"
          element={isLoggedIn ? <Dashboard onLogout={handleLogOut} userId={userId}/> : <Navigate replace to="/" />}
        />
        {/* Redirect any other path to the main page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

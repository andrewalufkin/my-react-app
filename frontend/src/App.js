import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage'; 
import HomePage from './HomePage';
import Dashboard from './DashBoard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  const handleLogIn = (userId, username) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setUsername(username);
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
        {/* HomePage Route */}
        <Route 
          path="/home"
          element={isLoggedIn ? <HomePage userId={userId} username={username}/> : <Navigate replace to="/" />}
        />
        {/* Redirect any other path to the main page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

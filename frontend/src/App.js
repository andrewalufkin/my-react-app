

import { useState } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './DashBoard';
import './App.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogIn = () => {
    setIsLoggedIn(true);
  }

  const handleLogOut = () => {
    setIsLoggedIn(false);
  }
  
  return (
    <div>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogOut} />
      ) : (
        <LoginPage onLogin={handleLogIn} />
      )
      }
    </div>
  );
}

export default App;

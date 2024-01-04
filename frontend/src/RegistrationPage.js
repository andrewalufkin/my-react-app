import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { registerUser } from './services/api';
import styles from './RegistrationPage.module.css';

const RegistrationPage = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await registerUser(username, password);
      console.log('Registration successful:', response);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('Username already exists. Please choose a different one.');
      }
      console.error('Registration failed:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(username, password);
  };

  const handleCancel = () => {
    navigate('/'); // Navigate back to the login page
  };

  return (
    <div className={styles.registrationPageContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Registration</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={handleUsernameChange} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit">Register</button>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>Cancel</button> 
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;

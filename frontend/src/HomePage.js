import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = ({ userId }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [status, setStatus] = useState('');
  
  const navigate = useNavigate();

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleDashboardButtonClick = () => {
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process and upload data here
    console.log('Status:', status);
    console.log('Profile Pic:', profilePic);
  };

  return (
    <div className={styles.homePage}>
      <h2>Home Page</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Status:
          <input type="text" value={status} onChange={handleStatusChange} />
        </label>
        <br />
        <label>
          Profile Picture:
          <input type="file" onChange={handleProfilePicChange} />
        </label>
        <br />
        <button type="submit">Save Changes</button>
        <button className={styles.dashboardButton} onClick={handleDashboardButtonClick}>
        Go to Dashboard
        </button>
      </form>
    </div>
  );
};

export default HomePage;

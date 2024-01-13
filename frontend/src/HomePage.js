import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserPosts } from './services/api';
import styles from './HomePage.module.css';

const HomePage = ({ userId, username }) => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API calls for profile picture and about me
    setProfilePicture('path/to/profilePicture.jpg');
    setAboutMe('This is about me...');

    // Fetch user posts
    const fetchPosts = async () => {
      const userPosts = await fetchUserPosts(userId);
      setPosts(userPosts.posts);
    };

    fetchPosts();
  }, [userId]);

  

  const handleDashboardButtonClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.profileCard}>
        <img src={profilePicture} alt="Profile" className={styles.profilePicture} />
        <h1>Hello, {username}!</h1>
        <p className={styles.aboutMe}>{aboutMe}</p>
        <button className={styles.dashboardButton} onClick={handleDashboardButtonClick}>Go to Dashboard</button>
      </div>
      <div className={styles.postsSection}>
        <p>Your Posts:</p>
        {posts.map((post, index) => (
          <div key={index} className={styles.post}>{post.content}</div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;


import React, { useState, useEffect } from 'react';
import { searchUsers, followUser, createPost, fetchFeed } from './services/api';
import styles from './DashBoard.module.css'

const Dashboard = ({ onLogout, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [postContent, setPostContent] = useState('');
  const [feed, setFeed] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try{
    const response = await searchUsers(searchTerm);
    setSearchResults(response.users);
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]); // Set empty results in case of error
    }
  };

  const handleFollow = async (followedId) => {
    followUser(userId, followedId);
  };

  const handleCreatePost = async () => {
    createPost(userId, postContent);
  };

  const loadFeed = async () => {
    try {
      const response = await fetchFeed(userId);
      setFeed(response.posts); // Assuming the response contains an array of posts
    } catch (error) {
      console.error('Error loading feed:', error);
      setFeed([]); // Set feed to empty in case of error
    }
  };

    // Load feed when component mounts or userId changes
    useEffect(() => {
      loadFeed();
    }, [userId]);

    return (
      <div className={styles.dashboard}>
        <div className={styles.dashboardControls}>
          <h1>Dashboard</h1>
  
          {/* Search Bar */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users"
            className={styles.input}
          />
          <button onClick={handleSearch} className={styles.button}>Search</button>
  
          {/* Search Results */}
          <div>
            {searchResults.map(user => (
              <div key={user.id} className={styles.userItem}>
                {user.username}
                <button onClick={() => handleFollow(user.id)} className={styles.button}>Follow</button>
              </div>
            ))}
          </div>
  
          {/* Post Creation */}
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className={styles.textarea}
          />
          <button onClick={handleCreatePost} className={styles.button}>Post</button>
          <button onClick={onLogout} className={styles.logoutButton}>Log Out</button>
        </div>
  
          {/* User's Feed */}
          <div className={styles.feedSection}>
            {[...feed].reverse().map(post => (
              <div key={post.id} className={styles.postItem}>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
      </div>
    );
  };

export default Dashboard;


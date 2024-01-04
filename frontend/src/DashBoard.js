import React, { useState, useEffect } from 'react';
import { searchUsers, followUser, createPost, fetchFeed } from './services/api';

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

  // Corrected loadFeed function
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
      <div className='dashboard' style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h1>Dashboard</h1>
  
          {/* Search Bar */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={handleSearch}>Search</button>
  
          {/* Search Results */}
          <div>
            {searchResults.map(user => (
              <div key={user.id}>
                {user.username} 
                <button onClick={() => handleFollow(user.id)}>Follow</button>
              </div>
            ))}
          </div>
  
          {/* Post Creation */}
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={handleCreatePost}>Post</button>
  
          <button onClick={onLogout}>Log Out</button>
        </div>
  
        {/* User's Feed */}
        <div style={{ flex: 2, overflow: 'auto', height: 'calc(100vh - 20px)' }}>
          {feed.map(post => (
            <div key={post.id} style={{ marginBottom: '10px' }}>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Dashboard;


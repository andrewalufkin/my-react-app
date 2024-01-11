import React, { useState, useEffect } from 'react';
import { searchUsers, followUser, createPost, fetchFeed, likePost, dislikePost, undoReaction } from './services/api';
import { useNavigate } from 'react-router-dom';
import styles from './DashBoard.module.css'

const Dashboard = ({ onLogout, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [postContent, setPostContent] = useState('');
  const [feed, setFeed] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  let navigate = useNavigate();

  const handleHomeButtonClick = () => {
    navigate('/home');
  };

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

  const handleLike = async (postId) => {
    try {
      const result = await likePost(userId, postId);
      if (result && result.message === 'Like added to post successfully') {
        setFeed(feed.map(post => 
          post.id === postId ? { ...post, likes_count: post.likes_count + 1, userLiked: true } : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  

  const handleDislike = async (postId) => {
    try {
      const result = await dislikePost(userId, postId);
      if (result && result.message === 'Dislike added to post successfully') {
        // Update the feed state with the new dislikes count
        setFeed(feed.map(post => 
          post.id === postId ? { ...post, dislikes_count: post.dislikes_count + 1, userDisliked: true } : post
        ));
      }
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  }

  // Function to handle undoing a like or dislike
const handleUndoReaction = async (postId, reactionType) => {
  try {
    const result = await undoReaction(userId, postId, reactionType); // TODO: implement this API call
    if (result && result.message === 'Reaction undone successfully') {
      // Update the feed state to reflect the undone reaction
      setFeed(feed.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: reactionType === 'like' ? post.likes_count - 1 : post.likes_count,
            dislikes_count: reactionType === 'dislike' ? post.dislikes_count - 1 : post.dislikes_count,
            userLiked: reactionType === 'like' ? false : post.userLiked,
            userDisliked: reactionType === 'dislike' ? false : post.userDisliked
          };
        }
        return post;
      }));
    }
  } catch (error) {
    console.error(`Error undoing ${reactionType}:`, error);
  }
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
          {/* Home Button */}
          <button className={styles.homeButton} onClick={handleHomeButtonClick}>Go to Home Page</button>
  
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
          {[...feed].map(post => (
            <div key={post.id} className={styles.postItem}>
              <strong>{post.authorName}</strong> {/* Display author's name */}
              <p>{post.content}</p>
              <div className={styles.reactions}>
                {post.userLiked || post.userDisliked ? (
                  <div className={styles.reactionInfo}>
                    {post.userLiked && <span>Post liked</span>}
                    {post.userDisliked && <span>Post disliked</span>}
                    <button onClick={() => handleUndoReaction(post.id, post.userLiked ? 'like' : 'dislike')} className={styles.undoButton}>Undo</button>
                    <span className={styles.space}></span> {/* Optional: Add some spacing */}
                    <span>{post.likes_count} likes</span>
                    <span>{post.dislikes_count} dislikes</span>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleLike(post.id)} className={styles.likeButton}>Like</button>
                    <span>{post.likes_count} likes</span>
                    <button onClick={() => handleDislike(post.id)} className={styles.dislikeButton}>Dislike</button>
                    <span>{post.dislikes_count} dislikes</span>
                  </>
                )}
            </div>
          </div>
          ))}
        </div>
      </div>
    );
  };

export default Dashboard;


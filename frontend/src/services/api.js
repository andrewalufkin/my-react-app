import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: baseURL
});

export default api;

export const registerUser = async (username, password) => {
  console.log('RegisterUser called.')
  try {
    const response = await api.post('/auth/register', {
      username,
      password,
    });

    return response.data; // The response.data will contain the server's response (e.g., success message or error)
  } catch (error) {
    console.log('Caught an error ' + error.response.status);
    // Handle errors here (e.g., show error messages to the user)
    console.error('Error while registering user:', error);
    throw error; // Rethrow the error to handle it in the component that called this function
  }
};
  
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });

    return response.data; // The response.data will contain the server's response (e.g., user data or error)
  } catch (error) {
    // Handle errors here (e.g., show error messages to the user)
    console.error('Error while logging in:', error);
    throw error; // Rethrow the error to handle it in the component that called this function
  }
};

export const searchUsers = async (searchTerm) => {
  try {
      const response = await api.get('/user/search', { params: { searchTerm } });
      return response.data;
  } catch (error) {
      console.error('Error searching users:', error);
      return [];
  }
};

export const followUser = async (followerId, followedId) => {
    try {
        const response = await api.post('/user/follow', { followerId, followedId });
        return response.data;
    } catch (error) {
        console.error('Error following user:', error);
    }
};

export const createPost = async (userId, content) => {
    try {
        const response = await api.post('/user/post', { userId, content });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
    }
};

export const fetchFeed = async (userId) => {
    try {
        const response = await api.get('/user/feed', { params: { userId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
};

// Function to send a like to a specific post
export const likePost = async (userId, postId) => {
  try {
      const response = await api.post('/user/post/like', { userId, postId });
      return response.data;
  } catch (error) {
      console.error('Error liking post:', error);
  }
};

// Function to send a dislike to a specific post
export const dislikePost = async (userId, postId) => {
  try {
      const response = await api.post('/user/post/dislike', { userId, postId });
      return response.data;
  } catch (error) {
      console.error('Error disliking post:', error);
  }
};

// Function to undo a like or dislike
export const undoReaction = async (userId, postId, reactionType) => {
  try {
      const response = await api.post('/user/post/undoReaction', { userId, postId, reactionType });
      return response.data;
  } catch (error) {
      console.error(`Error undoing ${reactionType}:`, error);
  }
};

// Function to get posts written by a specific user
export const fetchUserPosts = async (userId) => {
  try {
      const response = await api.get('/user/posts', { params: { userId } });
      return response.data;
  } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
  }
};
  
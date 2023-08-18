import axios from 'axios';

const api = axios.create({
    baseURL: 'http://3.92.228.150:3000'
});

export default api;

export const registerUser = async (username, password) => {
    console.log('RegisterUser called.')
    try {
      const response = await api.post('/register', {
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
      const response = await api.post('/login', {
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
  
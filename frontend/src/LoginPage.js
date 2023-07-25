import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterButton from './RegisterButton';
import RegistrationPanel from './RegistrationPanel';
import { registerUser, loginUser } from './services/api';

const LoginPage = ({onLogin}) => {
    const [isRegistrationOpen, setRegistrationOpen] = useState(false);

    const handleLogin = async (username, password) => {
        try {
            // Call the loginUser function to log in the user
            const response = await loginUser(username, password);
      
            // Handle the response from the server (e.g., save user data to state, show success message, etc.)
            console.log('Logged in successfully:', response);
            onLogin();
        } catch (error) {
            // Handle errors (e.g., show error messages to the user)
            console.error('Login failed:', error);
        }
        
    }

    const handleRegister = async (username, password) => {
        console.log('handleRegister called');
        try {
          // Call the registerUser function to register the user
          const response = await registerUser(username, password);
    
          // Handle the response from the server (e.g., show success message, redirect to login page, etc.)
          console.log('Registration successful:', response);
        } catch (error) {
          // Handle errors (e.g., show error messages to the user)
          console.log('Received error within handleRegister');
          if(error.response && error.response.status === 409){
            alert('Username already exists. Please choose a different one.');
          }
          console.error('Registration failed:', error);
        }
    };

    const handleRegisterClick = () => { 
        setRegistrationOpen(true);
    }

    const handleRegistrationClose = () => {
        setRegistrationOpen(false);
    }

    return (
        <div className='login-page'>
            <h1>LoginPage</h1>
            <LoginForm onLogin={handleLogin} />
            <RegisterButton onClick={handleRegisterClick}/>
            <RegistrationPanel isOpen={isRegistrationOpen} onClose={handleRegistrationClose} onRegister={handleRegister}/>
        </div>

    );
};

export default LoginPage;
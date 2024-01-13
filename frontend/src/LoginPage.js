import styles from './LoginPage.module.css'
import LoginForm from './LoginForm';
import { loginUser } from './services/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({onLogin}) => {
    let navigate = useNavigate();

    const handleLogin = async (username, password) => {
        try {
            // Call the loginUser function to log in the user
            const response = await loginUser(username, password); // TODO: show errors on the screen somehow
      
            // Handle the response from the server (e.g., save user data to state, show success message, etc.)
            onLogin(response.userId, username);
        } catch (error) {
            // Handle errors (e.g., show error messages to the user)
        }
        
    }

    const handleRegisterClick = () => {
        navigate('/register'); // This will navigate to the Register page
      };

    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome to my app!</h1>
                <LoginForm onLogin={handleLogin} />
                <button onClick={handleRegisterClick} className={styles.registerButton}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
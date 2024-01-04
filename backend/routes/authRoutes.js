// authRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Import database connection module

// Define authentication routes
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUsernameQuery, [username], (error, results) => {
        if (error) {
        console.error('Error checking username:', error);
        return res.status(500).json({ message: 'Internal server error' });
        }
    
        // If a row with the given username is found, it means the username is already taken
        if (results.length > 0) {
        return res.status(409).json({ message: 'Username already exists' });
        } else {
        // Insert user data into the database
        const sql = 'INSERT INTO users (username, password, registration_date) VALUES (?, ?, NOW())';
        connection.query(sql, [username, password], (err, result) => {
            if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'An error occurred while registering user.' });
            }
  
            return res.status(200).json({ message: 'User registered successfully.' });
        });
        }
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to check if the user exists and the password is correct
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ error: 'An error occurred while logging in.' });
    }

    if (result.length === 0) { 
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Extract the user's ID from the query result
    const userId = result[0].id;
    return res.status(200).json({ message: 'User logged in successfully.', userId: userId });
  });
});


module.exports = router;

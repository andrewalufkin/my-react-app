require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { readFile } = require('fs').promises;
const { addUser } = require('./userUtils');
const app = express();
const fs = require('fs');
const closeConnection = require('./closeConnection');

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://ec2-3-92-228-150.compute-1.amazonaws.com:3000',
  credentials: true, // Include cookies in cross-origin requests if needed
}));

//Connection details
const connection = mysql.createConnection({
    //These are stored in environment variables
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD, 
    database: process.env.RDS_DATABASE,
    port: 3306
});

//Connect to the RDS database.
connection.connect((err) => {
    if(err){
        console.error('Error connecting to the database.');
        return;
    }

    console.log('Connected to the database successfully.');
});

//Serve the front end react app from within the backend server. comment out while testing the 
//front end and back end separately
app.use(express.static(path.join(__dirname, '../frontend/build')));

//Listen on port 3000
const port = process.env.PORT || 3000 ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//API endpoints go here
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkUsernameQuery, [username], (error, results) => {
    if (error) {
      console.error('Error checking username:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If a row with the given username is found, it means the username is already taken
    if (results.length > 0) {
      console.log('Username already exists.');
      return res.status(409).json({ message: 'Username already exists' });
    } else {
      // Insert user data into the database
      const sql = 'INSERT INTO users (username, password, registration_date) VALUES (?, ?, NOW())';
      connection.query(sql, [username, password], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ error: 'An error occurred while registering user.' });
        }

        console.log('User registered successfully:', result);
        return res.status(200).json({ message: 'User registered successfully.' });
      });
    }
  });
});

// Route for user login
app.post('/login', (req, res) => {
  console.log('Backend received login request.');
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

    console.log('User logged in successfully:', result[0]);
    return res.status(200).json({ message: 'User logged in successfully.' });
  });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Handle server termination

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT (Ctrl-C)');
  closeConnection(connection);
});

process.on('exit', () => {
  console.log('Exiting the process.');
  closeConnection(connection);
});
  
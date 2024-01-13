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
const connection = require('./db/connection');
const closeConnection = require('./closeConnection');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(bodyParser.json());
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://ec2-3-92-228-150.compute-1.amazonaws.com:3000', 'http://localhost:3000'];
    if (!origin) return callback(null, true); // Allow requests with no origin, like mobile apps or curl requests
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});

//Listen on port 8000
const port = process.env.PORT || 8000 ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//API endpoints go here


app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});


app.options('*', cors()); // Allow preflight requests for all routes

app.use('/auth', authRoutes); // Mount authentication routes under /auth
app.use('/user', userRoutes); // Mount user routes under /user

// Handle server termination

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT (Ctrl-C)');
  closeConnection(connection);
});

process.on('exit', () => {
  console.log('Exiting the process.');
  closeConnection(connection);
});
  
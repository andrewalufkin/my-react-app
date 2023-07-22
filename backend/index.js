require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const { readFile } = require('fs').promises;
const { addUser } = require('./userUtils');
const app = express();


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

app.use(express.static(path.join(__dirname, 'my-react-app/build')));

//API endpoints go here
addUser(connection, 'Andrewalufkin', 'legos555');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-react-app/build', 'index.html'));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port ${port}');
});

connection.end((err) => {
    if (err) {
      console.error('Error closing the connection:', err);
      return;
    }
    console.log('Connection closed.');
  });
  
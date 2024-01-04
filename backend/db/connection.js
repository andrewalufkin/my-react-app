const mysql = require('mysql2');
require('dotenv').config();

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
        console.error('Error connecting to the database:', err);
        return;
    }

    console.log('Connected to the database successfully.');
});

module.exports = connection


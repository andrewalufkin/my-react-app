const mysql = require('mysql2');

// Function to add a new user to the database
function addUser(connection, username, password) {
    const newUser = {
      username: username,
      password: password,
      registration_date: new Date(),
    };
    const insertQuery = 'INSERT INTO users SET ?';

    return new Promise((resolve, reject) => {
        connection.query(insertQuery, newUser, (error, results) => {
          if (error) {
            console.error('Error inserting user:', error);
            reject(error);
          } else {
            console.log('User inserted successfully:', results);
            resolve(results);
          }
        });
    });

}

module.exports = {
    addUser
};
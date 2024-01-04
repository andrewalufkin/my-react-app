function closeConnection(connection) {
    let closing = false;

    if (!closing) {
      closing = true;
      console.log('Closing database connection...');
      connection.end((err) => {
        if (err) {
          console.error('Error closing the connection:', err);
        } else {
          console.log('Connection closed.');
        }
        process.exit(0);
      });
    }
  };

module.exports = closeConnection;
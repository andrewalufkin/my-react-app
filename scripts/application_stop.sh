#!/bin/bash

#!/bin/bash

# Application is running node.js and the process ID (PID) is stored in a file called "app.pid"
# Read the PID from the file
if [ -f "app.pid" ]; then
  PID=$(cat app.pid)

  # Check if the process is still running
  if ps -p $PID > /dev/null; then
    echo "Stopping the application with PID $PID"
    
    # Send the SIGINT signal to gracefully stop the application
    kill -SIGINT $PID
    
    # Wait for the process to exit (optional)
    wait $PID
  fi

  # Remove the PID file
  rm -f "app.pid"
fi




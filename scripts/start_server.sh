#!/bin/bash

# Full path to the Node.js executable
NODE_PATH=$(which node)

# Change to the backend destination directory
cd /home/ec2-user/backend

# Start the Node.js server using the full path to the executable
$NODE_PATH .

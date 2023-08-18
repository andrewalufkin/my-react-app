#!/bin/bash

# Navigate to the directory containing your Node.js server script
cd /home/ec2-user/backend

# Load NVM
source ~/.nvm/nvm.sh

# Use NVM to execute Node.js with the specific version
nvm exec v20.5.1 node index.js


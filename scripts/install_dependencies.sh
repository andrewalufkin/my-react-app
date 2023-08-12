#!/bin/bash

cd /home/ec2-user/frontend/build   # Change to the frontend destination directory
/.nvm/versions/node/v20.5.1/bin/npm install        # Install dependencies

cd ../backend # Change to the backened destination directory
/.nvm/versions/node/v20.5.1/bin/npm install # Install dependencies

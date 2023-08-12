#!/bin/bash

NODE_PATH=$(which node)  # Get the full path to the Node.js executable using which command

if [ -x "$NODE_PATH" ]; then
  cd /home/ec2-user/backend
  $NODE_PATH .
else
  echo "Node.js executable not found. Make sure it's in the PATH."
fi

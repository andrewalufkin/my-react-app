#!/bin/bash

# Replace "http://localhost:3000" with the actual URL of your application or service
APP_URL="ec2-3-92-228-150.compute-1.amazonaws.com"

# Perform a simple health check to verify that the application is running and responding
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "Application health check succeeded. Deployment was successful."
  exit 0
else
  echo "Application health check failed. Deployment was not successful."
  exit 1
fi

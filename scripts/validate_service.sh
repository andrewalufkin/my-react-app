#!/bin/bash

APP_URL="http://ec2-54-211-142-255.compute-1.amazonaws.com"

# Perform a simple health check to verify that the application is running and responding
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "Application health check succeeded. Deployment was successful."
  exit 0
else
  echo "Application health check failed. Deployment was not successful."
  exit 1
fi

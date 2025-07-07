#!/bin/bash

# Start the proxy server in the background
echo "Starting proxy server..."
node --experimental-modules server.js &
PROXY_PID=$!

# Start the frontend development server
echo "Starting frontend development server..."
npm run dev

# When the frontend server is stopped, also stop the proxy server
kill $PROXY_PID 
#!/bin/zsh

# Kill the process running on port 3000 and 3001. This is useful when you want
# to stop the local development server but you forgot to stop it before closing
# the Terminal app.
kill -9 $(lsof -ti:3000,3001)
# Wait 5 seconds so that the Terminal app (iTerm) does not show an error message
sleep 5
#!/bin/zsh
kill -9 $(lsof -ti:3000,3001)
# Wait 5 seconds so that the Terminal app (iTerm) does not show error message
sleep 5
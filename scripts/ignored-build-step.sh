#!/bin/bash

# If the commit target branch is dev or main, allow the Vercel build
if [[ "$VERCEL_GIT_COMMIT_REF" == "dev" || "$VERCEL_GIT_COMMIT_REF" == "main"  ]] ; then
  echo "✅ - Build can proceed"
  exit 1;

# Otherwise, cancel the build
else
  echo "🛑 - Build cancelled"
  exit 0;
fi
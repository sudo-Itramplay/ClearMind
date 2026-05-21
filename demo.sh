#!/usr/bin/env bash
# Start the ClearMind demo.
# Kills any existing dev server on :3000, then starts fresh.
# Every page load seeds today's mock data automatically.
#
# Mid-demo reset (without refreshing): run this in the browser console:
#   resetDemo()

set -e
cd "$(dirname "$0")"

if lsof -ti :3000 &>/dev/null; then
  echo "Stopping existing server on :3000..."
  lsof -ti :3000 | xargs kill -9
fi

echo "Starting ClearMind demo at http://localhost:3000"
npm run start

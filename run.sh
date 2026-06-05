#!/usr/bin/env bash
# One-command: install deps if needed, then start the Expo web dev server.
# The dev server hosts both the UI and the /api/voice route — voice works
# out of the box as long as ELEVENLABS_API_KEY is set in .env.local.
#
# Usage:
#   ./run.sh         # boots http://localhost:8081
#   ./run.sh test    # boots dev server + runs Playwright suite
#
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env.local ]; then
  echo "Missing .env.local. Copy .env.local.example and add your ELEVENLABS_API_KEY:"
  echo "  cp .env.local.example .env.local"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

# Ensure Playwright's Chromium is installed if user wants to test.
if [ "${1:-}" = "test" ]; then
  echo "Ensuring Playwright Chromium is installed..."
  npx playwright install chromium >/dev/null 2>&1 || true
  echo "Running E2E suite..."
  exec npx playwright test
fi

echo ""
echo "Starting RITE on http://localhost:8081"
echo "Press w in the Expo terminal to open the browser, or just visit the URL."
echo ""
exec npm run web

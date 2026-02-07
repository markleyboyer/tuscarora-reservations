#!/bin/bash

# Push Tuscarora Reservations to GitHub
# Run this script from your local machine

echo "═══════════════════════════════════════════════════════"
echo "  Pushing Tuscarora Reservations to GitHub"
echo "═══════════════════════════════════════════════════════"
echo ""

# Navigate to the project directory
cd "$(dirname "$0")"

# Check git status
echo "📋 Current status:"
git status
echo ""

# Push to GitHub (will prompt for credentials)
echo "🚀 Pushing to GitHub..."
echo "   You'll be prompted for your GitHub username and password"
echo "   (or Personal Access Token if you have 2FA enabled)"
echo ""

git push -u origin master

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! Your site has been pushed to GitHub"
  echo ""
  echo "🌐 Next steps:"
  echo "   1. Go to: https://github.com/markleyboyer/tuscarora-reservations/settings/pages"
  echo "   2. Under 'Source', select branch 'master' and folder '/ (root)'"
  echo "   3. Click 'Save'"
  echo "   4. Wait 1-2 minutes, then visit:"
  echo "      https://markleyboyer.github.io/tuscarora-reservations/"
  echo ""
else
  echo ""
  echo "❌ Push failed. Common solutions:"
  echo "   - Make sure you have access to the repository"
  echo "   - If using 2FA, use a Personal Access Token instead of password"
  echo "   - Generate token at: https://github.com/settings/tokens"
  echo ""
fi

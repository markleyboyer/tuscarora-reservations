#!/bin/bash

echo "═══════════════════════════════════════════════════════"
echo "  Updating Tuscarora Reservations on GitHub"
echo "═══════════════════════════════════════════════════════"
echo ""

cd "$(dirname "$0")"

# Add new files
echo "📝 Staging changes..."
git add logo.png app.jsx

# Commit changes
echo "💾 Committing changes..."
git commit -m "$(cat <<'EOF'
Update: Add real Tuscarora Club logo and flatten room list

- Replace placeholder logo with actual Tuscarora Club seal
- Remove building dropdown from booking flow
- Show all rooms in a flat list (Clubhouse #1, Farmhouse #1, etc.)
- Update room naming convention throughout
- Improve user experience with simplified room selection

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! Changes pushed to GitHub"
  echo ""
  echo "🌐 Your site will update automatically in 1-2 minutes at:"
  echo "   https://markleyboyer.github.io/tuscarora-reservations/"
  echo ""
else
  echo ""
  echo "❌ Push failed. You may need to pull first or check your credentials."
  echo ""
fi

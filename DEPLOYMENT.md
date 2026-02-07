# GitHub Pages Deployment Guide

## Step 1: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Name your repository (e.g., `tuscarora-reservations`)
5. Leave it as **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these instead:

```bash
# Change to the project directory
cd /path/to/tuscarora-reservations

# Rename branch to main (GitHub's default)
git branch -M main

# Add your GitHub repository as remote
# Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual values
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push your code
git push -u origin main
```

### Example:
If your GitHub username is `markley` and repository is `tuscarora-reservations`:
```bash
git remote add origin https://github.com/markley/tuscarora-reservations.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **"Save"**

## Step 4: Access Your Site

GitHub Pages will build your site automatically. After a few minutes (usually 1-2 min), your site will be live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

**Example:** `https://markley.github.io/tuscarora-reservations/`

You'll see a green checkmark with a "Visit site" button when it's ready.

## Updating Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild and deploy within 1-2 minutes.

## Custom Domain (Optional)

If you want to use a custom domain like `reservations.tuscaroraclub.com`:

1. In your domain registrar (where you bought the domain), add a CNAME record:
   - **Name/Host**: `reservations` (or whatever subdomain you want)
   - **Value**: `YOUR-USERNAME.github.io`

2. In GitHub repository settings → Pages → Custom domain:
   - Enter: `reservations.tuscaroraclub.com`
   - Click Save
   - Enable "Enforce HTTPS" after DNS propagates (wait ~24 hours)

## Troubleshooting

### Site not showing?
- Wait 2-3 minutes after pushing
- Check Settings → Pages for deployment status
- Ensure repository is Public
- Check that index.html is in the root folder

### Changes not appearing?
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 1-2 minutes for GitHub to rebuild
- Check the repository "Actions" tab for build status

### Icons not showing?
- This is usually a CDN caching issue - wait a few minutes
- If persistent, check browser console for errors

---

**Your site is ready to share!** 🎉

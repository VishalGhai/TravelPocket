# GitHub Secrets Setup Guide

## 🔐 Setting Up Repository Secrets

### Step 1: Access Repository Settings

1. **Navigate to your repository**: https://github.com/vishalghai/TravelPocket
2. **Click "Settings"** (in the top navigation bar)
3. **In the left sidebar, click "Secrets and variables"**
4. **Click "Actions"** (for GitHub Actions secrets)

### Step 2: Add Your API Key Secret

1. **Click "New repository secret"**
2. **Name**: `REACT_APP_GEMINI_API_KEY`
3. **Secret**: Paste your new Gemini API key
4. **Click "Add secret"**

### Step 3: Enable GitHub Pages

1. **Go to "Pages" in the left sidebar**
2. **Source**: Select "GitHub Actions"
3. **Save the settings**

## 🚀 Deployment Methods

### Method 1: GitHub Actions (Recommended)

**Advantages:**
- ✅ API key is secure (stored in secrets)
- ✅ Automatic deployment on push
- ✅ No local API key exposure
- ✅ Build logs and error tracking

**How it works:**
1. Push code to `main` branch
2. GitHub Actions automatically builds with secret
3. Deploys to GitHub Pages
4. No manual intervention needed

### Method 2: Local Deployment (Alternative)

**Use when:**
- Testing locally
- Quick manual deployments
- When GitHub Actions is not available

**Commands:**
```bash
# Build with local environment
npm run build

# Deploy using local gh-pages
npm run deploy:local
```

## 🔧 Configuration Files

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_GEMINI_API_KEY: ${{ secrets.REACT_APP_GEMINI_API_KEY }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

## 📋 Complete Setup Checklist

### Before Setting Up Secrets:
- [ ] Revoke old exposed API key
- [ ] Generate new API key from Google AI Studio
- [ ] Test new API key locally

### GitHub Repository Setup:
- [ ] Go to repository Settings
- [ ] Navigate to Secrets and variables > Actions
- [ ] Add `REACT_APP_GEMINI_API_KEY` secret
- [ ] Enable GitHub Pages with GitHub Actions source

### Code Setup:
- [ ] Commit the GitHub Actions workflow
- [ ] Push changes to main branch
- [ ] Verify deployment works automatically

### Testing:
- [ ] Check GitHub Actions tab for successful builds
- [ ] Verify site loads at https://vishalghai.github.io/TravelPocket/
- [ ] Test API functionality on deployed site

## 🔍 Troubleshooting

### Common Issues:

**1. Secret not found:**
- Verify secret name matches exactly: `REACT_APP_GEMINI_API_KEY`
- Check secret is added to the correct repository

**2. Build fails:**
- Check GitHub Actions logs
- Verify API key is valid
- Ensure all dependencies are in package.json

**3. Site shows blank:**
- Check browser console for errors
- Verify API key is working
- Check if routing is properly configured

### Debug Commands:
```bash
# Test local build
npm run build

# Check if secret is accessible (in GitHub Actions)
echo "API key length: ${#REACT_APP_GEMINI_API_KEY}"

# Verify build output
ls -la build/
```

## 🛡️ Security Best Practices

### Repository Secrets:
- ✅ Never commit API keys to code
- ✅ Use descriptive secret names
- ✅ Rotate secrets regularly
- ✅ Monitor secret usage

### GitHub Actions:
- ✅ Use minimal permissions
- ✅ Review workflow files before committing
- ✅ Monitor build logs for errors
- ✅ Keep dependencies updated

### Local Development:
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `.env.example` for templates
- ✅ Never share API keys in chat/email
- ✅ Use different keys for dev/prod

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify secret configuration
3. Test API key independently
4. Review this guide step by step

## 🔄 Next Steps After Setup

1. **Test the deployment** by pushing a small change
2. **Monitor the first few deployments** to ensure stability
3. **Set up monitoring** for API usage and errors
4. **Consider adding more secrets** for other services if needed
5. **Document the process** for your team

# 🚀 Deployment Guide - NutraFuel AI Platform

## 📋 Quick Setup Summary

**Ready for Deployment!** ✅ Your NutraFuel AI platform is fully prepared with:
- 428 files committed and ready to push
- Comprehensive README.md
- Proper .gitignore configuration  
- 10 specialized AI agents
- Modern Next.js frontend
- FastAPI backend

## 🔑 Step 1: Push to GitHub

### Option A: Using Personal Access Token (Recommended)

1. **Generate GitHub Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`
   - Copy the token

2. **Push to GitHub**:
   ```bash
   # In your terminal (already in RAG EX directory)
   git push -u origin main
   
   # When prompted:
   # Username: johnders
   # Password: [paste your personal access token]
   ```

### Option B: Using SSH (Alternative)

1. **Set up SSH key** (if not already done):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   cat ~/.ssh/id_ed25519.pub  # Copy this to GitHub SSH keys
   ```

2. **Change remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:johnders/client-ai-demo.git
   git push -u origin main
   ```

## 🌐 Step 2: Deploy on Render

### Backend Deployment (API Server)

1. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `johnders/client-ai-demo`

2. **Configure Backend Service**:
   ```yaml
   Name: nutrafuel-api
   Region: Oregon (US West) or nearest
   Branch: main
   Root Directory: (leave empty)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python3 api_server.py
   Instance Type: Starter ($7/month)
   ```

3. **Environment Variables**:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=8000
   ```

4. **Expected Result**:
   - Backend URL: `https://nutrafuel-api-xyz.onrender.com`
   - API Docs: `https://nutrafuel-api-xyz.onrender.com/docs`

### Frontend Deployment (Next.js)

1. **Create Static Site**:
   - Render Dashboard → "New +" → "Static Site"
   - Same repository: `johnders/client-ai-demo`

2. **Configure Frontend Service**:
   ```yaml
   Name: nutrafuel-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build && npm run export
   Publish Directory: frontend/out
   ```

3. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_API_URL=https://nutrafuel-api-xyz.onrender.com
   NODE_VERSION=18.17.0
   ```

### Frontend Configuration for Static Export

First, update `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
}

module.exports = nextConfig
```

Add export script to `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "export": "next export",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 🔧 Step 3: Update API URLs (After Deployment)

Once you have your Render backend URL, update the frontend:

**In `frontend/app/page.tsx` and `frontend/app/admin/page.tsx`**:

```typescript
// Replace this line:
axios.defaults.baseURL = 'http://localhost:8000'

// With:
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

Then redeploy the frontend.

## 🎯 Step 4: Test Your Live Deployment

### Customer Site Testing
- **URL**: `https://nutrafuel-frontend-xyz.onrender.com`
- **Test Voice**: Click microphone, say "Find supplements for muscle building"
- **Test Search**: "A stack to preserve muscle mass but burn fat"
- **Test Rachel**: Chat with nutrition agent
- **Test Customer Service**: "Track order #1439221"

### Admin Dashboard Testing  
- **URL**: `https://nutrafuel-frontend-xyz.onrender.com/admin`
- **Test Financial Reports**: "How did Q2 compare to Q1?"
- **Test Landing Pages**: "Build landing page for collagen powder"
- **Test Review Synthesis**: "Summarize customer feedback"

## 🐛 Troubleshooting

### Common Issues

1. **API Server Won't Start**:
   ```bash
   # Check environment variables are set
   # Verify OpenAI API key is valid
   # Check build logs for Python dependency errors
   ```

2. **Frontend Build Fails**:
   ```bash
   # Ensure Node.js 18.17.0+ 
   # Check for TypeScript errors
   # Verify all dependencies install correctly
   ```

3. **CORS Errors**:
   ```python
   # In api_server.py, update CORS origins:
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://nutrafuel-frontend-xyz.onrender.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### Performance Tips

1. **Keep Services Warm**:
   - Render free tier sleeps after 15 minutes
   - Consider upgrading to paid tier for production
   - Use external monitoring service to ping endpoints

2. **Optimize Build Times**:
   - Cache node_modules and Python packages
   - Use Docker for consistent builds (optional)

## 📊 Monitoring & Analytics

### Health Checks
- **API Health**: `https://your-api.onrender.com/health`
- **Frontend Health**: Check if main page loads
- **Agent Status**: Test all 10 agents via `/docs` interface

### Key Metrics to Track
- **Response Times**: API endpoints < 2 seconds
- **Agent Accuracy**: AI response quality
- **User Engagement**: Time spent with AI features
- **Error Rates**: Failed API calls or frontend errors

## 🔒 Security Considerations

1. **API Keys**: Never commit to repository
2. **CORS**: Restrict to your domain only
3. **Rate Limiting**: Consider adding for production
4. **SSL**: Render provides automatically

## 🚀 Going Live

Once deployed, your platform will be accessible at:

**Customer Experience**: `https://nutrafuel-frontend-xyz.onrender.com`
- Modern ecommerce site with AI features
- Voice agent, intelligent search, conversational agents
- Shopping cart, product catalog, customer service

**Admin Dashboard**: `https://nutrafuel-frontend-xyz.onrender.com/admin`
- Business intelligence and analytics
- Chart generation, landing page builder
- Review synthesis, financial reporting

**API Documentation**: `https://nutrafuel-api-xyz.onrender.com/docs`
- Interactive API testing interface
- All 10 agents accessible via REST API

---

## 🎉 Success! 

Your AI-powered nutrition platform is now live and ready for:
- ✅ Client demonstrations
- ✅ Business pitches  
- ✅ User testing
- ✅ Further development

**Need help?** Check the troubleshooting section or open an issue on GitHub! 
# Vercel Deployment Guide for TheEyeBall

This guide explains how to deploy your TheEyeBall frontend to Vercel while keeping your backend on your current infrastructure.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your project should be in a GitHub repository
3. **Backend API**: Your backend should be deployed and accessible via HTTPS

## Deployment Steps

### 1. Prepare Your Repository

Ensure your project structure is clean and ready for deployment:

```bash
# Make sure you're in the project root
cd /Users/renillacmane/Documents/Runtime/Projects/TheEyeBall

# Add and commit the new Vercel configuration
git add frontend/vercel.json
git add frontend/vite.config.js
git add frontend/env.template
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Connect to Vercel

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in
2. **Import Project**: Click "New Project" and import your GitHub repository
3. **Configure Project**:
   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Set to `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Environment Variables

In the Vercel dashboard, add these environment variables:

```
VITE_API_URL=https://your-backend-api.com
VITE_NODE_ENV=production
VITE_APP_NAME=TheEyeBall
VITE_APP_VERSION=1.0.0
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**Important**: Replace `https://your-backend-api.com` with your actual backend URL.

### 4. Deploy

1. Click "Deploy" in the Vercel dashboard
2. Vercel will automatically build and deploy your frontend
3. You'll get a URL like `https://your-project.vercel.app`

## Backend Considerations

Since you're deploying only the frontend to Vercel, you need to ensure your backend is:

### 1. **Deployed and Accessible**
- Your backend should be deployed to a service like:
  - **Railway** (recommended for Node.js)
  - **Heroku**
  - **DigitalOcean App Platform**
  - **AWS EC2/ECS**
  - **Your own VPS**

### 2. **CORS Configuration**
Update your backend CORS settings to allow your Vercel domain:

```javascript
// In your backend middleware/cors.js
const corsOptions = {
  origin: [
    'http://localhost:3000', // Development
    'https://your-project.vercel.app', // Vercel production
    'https://your-custom-domain.com' // Custom domain
  ],
  credentials: true
};
```

### 3. **Environment Variables**
Ensure your backend has the correct environment variables for production:

```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
TMDB_API_KEY=your-tmdb-api-key
```

## Custom Domain (Optional)

1. **Add Domain**: In Vercel dashboard, go to your project settings
2. **Configure DNS**: Add the required DNS records
3. **SSL Certificate**: Vercel automatically provides SSL certificates

## Monitoring and Analytics

Vercel provides built-in analytics:
- **Performance metrics**
- **Usage statistics**
- **Error tracking**
- **Real-time logs**

## Deployment Workflow

### Automatic Deployments
- **Production**: Deploys automatically when you push to `main` branch
- **Preview**: Creates preview deployments for pull requests

### Manual Deployments
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your frontend directory
cd frontend
vercel

# Deploy to production
vercel --prod
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check your `package.json` scripts
   - Ensure all dependencies are in `dependencies`, not `devDependencies`
   - Verify your `vite.config.js` configuration

2. **Environment Variables**
   - Make sure all `VITE_` prefixed variables are set in Vercel dashboard
   - Check that your backend URL is correct and accessible

3. **CORS Errors**
   - Update your backend CORS configuration
   - Ensure your backend is accessible via HTTPS

4. **API Connection Issues**
   - Verify your backend is running and accessible
   - Check network requests in browser dev tools
   - Ensure your backend URL doesn't have trailing slashes

### Performance Optimization

The Vercel configuration includes:
- **Code splitting** for better loading performance
- **Asset optimization** with proper caching headers
- **CDN distribution** for global performance

## Cost Considerations

### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for commercial use
- **Enterprise**: Custom pricing

### Backend Hosting
Consider these options for your backend:
- **Railway**: $5/month for small projects
- **Heroku**: $7/month for basic dyno
- **DigitalOcean**: $5/month for basic droplet
- **AWS**: Pay-as-you-go pricing

## Next Steps

1. **Deploy your backend** to a cloud service
2. **Update CORS settings** in your backend
3. **Deploy frontend to Vercel** following this guide
4. **Test the full application** end-to-end
5. **Set up monitoring** and error tracking
6. **Configure custom domain** if needed

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **React Documentation**: [react.dev](https://react.dev)

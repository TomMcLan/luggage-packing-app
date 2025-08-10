# 🚀 Deployment Guide - Luggage Packing Assistant

## Overview
This guide helps you deploy your AI-powered luggage packing assistant to production.

## Prerequisites
- GitHub account
- Railway account (for backend)
- Vercel account (for frontend)
- OpenAI API key with GPT-4 Vision access
- Cloudinary account for image storage

## Step 1: Deploy Backend to Railway

1. **Go to Railway**: [railway.app](https://railway.app)
2. **Sign in with GitHub**
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select**: Your repository
5. **Root Directory**: `backend` ⚠️ Important!
6. **Environment Variables**: Add these in Railway dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   NODE_ENV=production
   PORT=8080
   ```
7. **Deploy** and note the Railway URL

## Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**: [vercel.com](https://vercel.com)
2. **Sign in with GitHub**
3. **New Project** → Import your repository
4. **Root Directory**: `frontend` ⚠️ Important!
5. **Environment Variables**: Add this in Vercel dashboard:
   ```
   BACKEND_URL=https://your-railway-url.railway.app
   ```
6. **Deploy**

## Step 3: Update CORS

1. **Go back to Railway** → Your project → Variables
2. **Add**:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
3. Backend will auto-redeploy

## Testing Your Deployment

- **Backend Health**: `https://your-railway-url.railway.app/health`
- **Frontend App**: `https://your-vercel-url.vercel.app`

## Features
- ✅ AI item detection using OpenAI Vision
- ✅ Cloud image storage via Cloudinary
- ✅ 8 scientific packing methods
- ✅ Mobile-responsive design
- ✅ Real-time recommendations

Your AI luggage packing assistant is now live! 🧳
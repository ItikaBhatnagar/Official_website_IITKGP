# Railway Deployment Guide

## Prerequisites
- GitHub account with this repository pushed
- Railway account (free signup at railway.app)

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/gg-conference-site-demo1.git
git branch -M main
git push -u origin main
```

## Step 2: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub account
4. Select `gg-conference-site-demo1` repository
5. Railway will auto-detect Node.js and create a deployment

## Step 3: Add PostgreSQL Database
1. In your Railway project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically set the `DATABASE_URL` environment variable
3. The database is ready to use!

## Step 4: Set Environment Variables
1. Go to your project's **"Variables"** tab
2. Add these variables:
   ```
   NODE_ENV = production
   ADMIN_PASSWORD = your_admin_password_here
   ADMIN_KEY = your_admin_key_here
   ```

## Step 5: Configure Build & Deployment
1. Click on the **web** service (your Node app)
2. Go to **"Settings"** tab
3. Set **Build Command**: (leave empty - it auto-detects from package.json)
4. Set **Start Command**: `npm run start`
5. Save changes

## Step 6: Run Deployment
1. Railway will automatically deploy when you push to GitHub
2. Check the **"Deployments"** tab to monitor the build
3. Once complete, click the **"View Logs"** button to verify startup
4. Your app URL will be shown at the top (e.g., `sse-conference-prod.up.railway.app`)

## Step 7: Verify the Deployment
```bash
# Health check
curl https://YOUR_RAILWAY_URL/api/healthz

# Should return:
# {"status":"ok","timestamp":"2026-04-22T..."}
```

## Managing Environment Variables
After deployment, you can:
- Update `ADMIN_PASSWORD` and `ADMIN_KEY` in Railway Variables dashboard
- Add new env vars without redeploying
- Changes are applied immediately to running process

## Database Migrations
The `Procfile` automatically runs migrations on each deploy:
```
release: npm run db:push
```
This ensures your Prisma schema is always in sync with production.

## Rollback
Need to revert a deployment? Click **"Redeploy"** on any previous deployment in the Deployments tab.

## Troubleshooting
- **Build fails**: Check the build logs in Railway dashboard
- **App crashes**: Check runtime logs for errors
- **Database errors**: Verify `DATABASE_URL` is set correctly (Railway sets this automatically)
- **CORS errors**: The app auto-configures CORS for production (origin: true)

---

Your site is now live on Railway! 🚀

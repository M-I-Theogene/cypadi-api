# Deployment Guide - Backend to Render

## Step 1: Deploy Backend to Render.com

### 1.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended) or email
3. Verify your email if needed

### 1.2 Create New Web Service

1. Click **"New +"** button in dashboard
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - If your code is on GitHub: Click "Connect GitHub" and select your repo
   - If not on GitHub: Use "Public Git repository" or "Manual Deploy"

### 1.3 Configure the Service

Fill in these settings:

- **Name**: `cypadi-api` (or any name you prefer)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server` ⚠️ **IMPORTANT: Set this to `server`**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 1.4 Set Environment Variables

Click on **"Environment"** tab and add these variables:

```
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
PORT=10000
```

**Important Notes:**

- Get `MONGODB_URI` from MongoDB Atlas (if using Atlas) or your MongoDB connection string
- `JWT_SECRET` should be a long, random string (you can generate one)
- `PORT` is optional - Render sets it automatically, but you can specify

### 1.5 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll get a URL like: `https://cypadi-api.onrender.com`

### 1.6 Test Your API

1. Visit: `https://your-api-url.onrender.com/api/health`
2. You should see: `{"status":"OK","message":"Cypadi Blog API is running"}`

---

## Step 2: Update Frontend Environment Files

### 2.1 Update .env.production Files

Once you have your Render API URL, update both environment files:

**Root directory `.env.production`:**

```
VITE_API_URL=https://your-actual-api-url.onrender.com/api
```

**`mis-blog/.env.production`:**

```
VITE_API_URL=https://your-actual-api-url.onrender.com/api
```

Replace `your-actual-api-url.onrender.com` with your actual Render URL.

### 2.2 Rebuild Frontends

After updating the environment files:

**Main Site:**

```bash
cd C:\xampp\htdocs\cypadi\site2\site
npm run build
```

**Admin Panel:**

```bash
cd mis-blog
npm run build
```

### 2.3 Re-upload to cPanel

1. Upload the new `dist` folder contents to your cPanel:
   - Main site → `public_html`
   - Admin panel → `public_html/blog` (or your subdomain folder)

---

## Step 3: Verify Everything Works

### 3.1 Test Main Site

1. Visit `https://cypadi.com`
2. Check if blog posts load
3. Try submitting the contact form

### 3.2 Test Admin Panel

1. Visit `https://blog.cypadi.com`
2. Try logging in
3. Test creating/editing posts

### 3.3 Check Browser Console

- Open browser DevTools (F12)
- Check Console tab for any errors
- Check Network tab to see if API calls are going to your Render URL

---

## Troubleshooting

### API Not Responding

- Check Render dashboard for deployment status
- Check Render logs for errors
- Verify environment variables are set correctly
- Make sure MongoDB connection string is correct

### CORS Errors

- Verify your Render API URL is in the CORS origins list in `server/server.js`
- Make sure you've updated CORS with your actual frontend domains

### 502 Bad Gateway

- Check Render logs
- Verify `MONGODB_URI` is correct
- Check if MongoDB Atlas allows connections from Render's IPs (whitelist 0.0.0.0/0)

### Frontend Not Connecting to API

- Verify `.env.production` files have the correct API URL
- Rebuild frontends after updating environment files
- Clear browser cache

---

## Important Notes

1. **Render Free Tier**:

   - Spins down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds
   - Consider upgrading to paid plan for always-on service

2. **MongoDB Atlas**:

   - Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
   - Or add Render's IP addresses to whitelist

3. **Environment Variables**:
   - Never commit `.env` files to GitHub
   - Always set them in Render dashboard
   - Keep secrets secure

---

## Next Steps After Deployment

1. ✅ Deploy backend to Render
2. ✅ Get your API URL
3. ✅ Update `.env.production` files
4. ✅ Rebuild frontends
5. ✅ Re-upload to cPanel
6. ✅ Test everything
7. ✅ Monitor Render logs for any issues

Good luck with your deployment! 🚀

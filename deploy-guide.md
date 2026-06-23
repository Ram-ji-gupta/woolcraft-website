# WoolCraft Studio — Deployment Guide

## 1. Export Your XAMPP MySQL Database

### Step 1: Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL**

### Step 2: Export Database using phpMyAdmin
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Select your database (e.g., `woolcraft`)
3. Click **Export** in the top menu
4. Choose:
   - Export method: **Quick** (default)
   - Format: **SQL**
5. Click **Go**
6. Save the SQL file as `woolcraft-database.sql`

## 2. Choose a Hosting Provider

### Recommended Hosting Options:

#### Option A: Vercel (Frontend) + Render/Heroku (Backend) + PlanetScale/Clever Cloud (MySQL)
- Free tier available
- Easy to deploy

#### Option B: CPanel Hosting (Full Stack)
- Many providers available (e.g., Hostinger, Bluehost, GoDaddy)
- Includes cPanel for easy management

---

## 3. Deployment Guide for Option A (Vercel + Render + PlanetScale)

### Part 1: Deploy Frontend to Vercel

1. Create a GitHub/GitLab account
2. Push your project to a Git repository (exclude `node_modules`, `.env`, `uploads`)
3. Go to: https://vercel.com/
4. Sign up and connect your Git repository
5. Configure:
   - Root Directory: (leave as root or select your project folder)
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Deploy!

### Part 2: Deploy Backend to Render

1. Go to: https://render.com/
2. Sign up
3. Click **New** → **Web Service**
4. Connect your Git repository
5. Configure:
   - Root Directory: `backend`
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables:
   - Copy from your `backend/.env` file
   - Add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`, `JWT_SECRET`

### Part 3: Set Up MySQL Database on PlanetScale

1. Go to: https://planetscale.com/
2. Sign up and create a new database
3. Get your database credentials (host, user, password, database name)
4. Import your `woolcraft-database.sql` file using the PlanetScale dashboard
5. Update your backend environment variables on Render with PlanetScale credentials

---

## 4. Deployment Guide for Option B (cPanel Hosting)

### Step 1: Upload Files to cPanel

1. Log in to your hosting account's cPanel
2. Open **File Manager**
3. Upload your project files (exclude `node_modules`)
4. Create a new folder for the backend (e.g., `backend`)
5. Upload backend files to the `backend` folder

### Step 2: Import Database to cPanel

1. In cPanel, go to **MySQL Databases**
2. Create a new database and user
3. Assign the user to the database with all privileges
4. Go to **phpMyAdmin** in cPanel
5. Select your new database
6. Click **Import**
7. Select your `woolcraft-database.sql` file
8. Click **Go**

### Step 3: Configure Backend on cPanel

1. Update `backend/.env` file with cPanel database credentials
2. In cPanel, go to **Terminal** or use SSH
3. Navigate to the backend folder: `cd backend`
4. Install dependencies: `npm install`
5. Start the server (use PM2 for process management: `npm install -g pm2` then `pm2 start server.js`)

### Step 4: Configure Frontend API Base URL

- Update `js/config.js` API_BASE to your production backend URL

---

## 5. Production Checklist

- [ ] Update API URLs in frontend (from `http://localhost:5000` to your production backend URL)
- [ ] Generate a strong JWT_SECRET key
- [ ] Use HTTPS (SSL) in production
- [ ] Update CORS allowed origins in `backend/server.js`
- [ ] Set up environment variables correctly
- [ ] Disable debugging/development features
- [ ] Test all functionality after deployment

---

## 6. Optional: Use SQLite for Simpler Deployment (No MySQL)

If you want to avoid managing a separate MySQL database, you can switch to SQLite. See the project's database options for more details!

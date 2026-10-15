# 🛍️ StoreForge Platform — Universal Production Pre-compiled Release

High-performance, production-ready pre-compiled release running 3 isolated micro-services:
- 🛍️ **Customer Storefront**: Port 3000 (*Theme: 3D Wooden Map*)
- 🔐 **Admin Portal**: Port 4000 (*StoreForge Administration*)
- ⚙️ **Backend REST API**: Port 8585 (*NestJS REST API Engine*)

---

## 📋 Server Requirements & Compatibility
- **Environment**: Supported on **cPanel (Node.js Selector / Passenger)**, **Bare Linux VPS (Ubuntu, Debian, CentOS, AlmaLinux)**, **Windows VPS/Server**, **Cloud Hosts (Render, Railway, Fly.io, AWS EC2, DigitalOcean)**, and **Docker**.
- **Node.js**: `>= 18.0.0` (Node 20 LTS or 22 LTS recommended)
- **PostgreSQL**: `>= 14` (cPanel PostgreSQL, Local PostgreSQL, Supabase, Neon, Railway, RDS, or Docker)
- **RAM**: Only **~150MB** required at runtime (runs smoothly on any 512MB / 1GB VPS or shared hosting account).

---

## ⚡ Deployment Options

### Option A: cPanel Hosting (Phusion Passenger / CloudLinux Node.js)
1. **Upload Files**: Upload this release folder to your cPanel directory (e.g., `public_html` or a dedicated app directory).
2. **Setup Node.js App in cPanel**:
   - Go to **Setup Node.js App** in cPanel.
   - Click **Create Application**.
   - **Node.js version**: Choose `20.x` or `18.x`.
   - **Application mode**: `Production`.
   - **Application root**: Path to your uploaded folder.
   - **Application startup file**: `server.js` (or `app.js`).
3. **Configure Environment Variables**:
   - Create or edit `.env` in the application root.
   - Set your PostgreSQL database connection:
     ```env
     DATABASE_URL="postgresql://username:password@localhost:5432/databasename?schema=public"
     ```
   - Set a secure random key for JWT:
     ```env
     JWT_SECRET="generate_a_random_32_character_string_here"
     ```
4. **Install Dependencies**:
   - In cPanel, click **Run NPM Install** (or run `npm install --omit=dev` via terminal).
5. **Reverse Proxy Configuration**:
   - Copy `.htaccess.example` to `.htaccess` in your `public_html` so Apache routes visitors to the Next.js Storefront (:3000) and API calls to NestJS (:8585).
6. **Start Application**: Click **Restart** in cPanel.

---

### Option B: Linux VPS (PM2 — DigitalOcean, Linode, AWS, Hetzner, Vultr)
1. Install production dependencies:
   ```bash
   npm install --omit=dev
   ```
2. Configure `.env` with your `DATABASE_URL` and `JWT_SECRET`.
3. Launch with PM2 process manager:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
4. **Nginx Reverse Proxy**:
   - Copy `nginx.conf.example` to `/etc/nginx/sites-available/storeforge`.
   - Update your domain name, symlink to `sites-enabled`, and run `systemctl reload nginx`.

---

### Option C: Direct Linux / macOS Execution (Without Docker)
1. Install dependencies & initialize:
   ```bash
   npm install --omit=dev
   ```
2. Configure `.env` with your PostgreSQL database URL.
3. Start the entire cluster:
   ```bash
   ./start.sh
   # or
   npm start
   ```

---

### Option D: Windows Server / Windows VPS
1. Configure your database connection in `.env`.
2. Double-click `start.bat` (or run `start.bat` from Command Prompt / PowerShell).

---

### Option E: Docker Deployment (Optional)
If you prefer running inside Docker containers:
```bash
docker compose up -d
```

---

## 🌐 Default Ports & Access Points

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **🛍️ Storefront** | [http://localhost:3000](http://localhost:3000) | Customer-facing store & checkout |
| **🔐 Admin Portal** | [http://localhost:4000](http://localhost:4000) | Master control panel & inventory |
| **⚙️ Backend API** | [http://localhost:8585/api](http://localhost:8585/api) | NestJS REST API endpoints |

### 🔑 First-Time Superadmin Setup:
When you open the **Admin Portal** ([http://localhost:4000](http://localhost:4000)) for the very first time:
1. **Step 1 (Admin Profile):** Enter your custom administrator name, master email/phone, and password.
2. **Step 2 (Site Configuration):** Set your store name, website title, support contact details, and delivery charges.
3. Upon completion, you will be automatically logged in to the dashboard. The setup wizard will never show again.

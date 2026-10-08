# 🚀 Wooden Mir E-Commerce — Pre-compiled Production Release

This directory contains the fully pre-compiled, optimized production bundle of Wooden Mir E-Commerce.

### 📋 Requirements on Server
- **Node.js**: `>= 18.0.0` (Node 20 LTS or 22 LTS recommended)
- **PostgreSQL**: `>= 14`
- **RAM**: Only **~150MB** required at runtime (Pre-compiled mode active).

---

### ⚡ Quick Deployment Steps

1. **Install Production Dependencies**:
   ```bash
   npm install --omit=dev
   ```

2. **Run the 1-Click Automated Setup Wizard**:
   ```bash
   npm run install:wizard
   ```
   *(Or for browser wizard: `node installation/index.js --web` on port 4000)*

3. **Start the Production Services**:
   ```bash
   npm run start
   ```

/**
 * ==============================================================================
 * 🛍️ StoreForge Platform — PM2 Process Manager Configuration
 * ==============================================================================
 *
 * Usage on any Linux / Windows VPS:
 *   npm install -g pm2
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 *
 * Management commands:
 *   pm2 status
 *   pm2 logs
 *   pm2 restart storeforge
 *   pm2 stop storeforge
 * ==============================================================================
 */

module.exports = {
  apps: [
    {
      name: 'storeforge',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

const http = require('http');
const path = require('path');
const { SystemChecker } = require('./checker');
const { Configurator } = require('./configurator');
const { Migrator } = require('./migrator');
const { ProjectCompiler } = require('./compiler');

/**
 * Lightweight Zero-Dependency Web Installer Wizard
 */
function fetchPublicIp() {
  return new Promise((resolve) => {
    const https = require('https');
    const req = https.get('https://api.ipify.org', { timeout: 1500 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data.trim() || null));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === '127.0.0.1' || ip === 'localhost') return true;
  return (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||
    ip.startsWith('172.3') ||
    ip.startsWith('198.18.') ||
    ip.startsWith('198.19.') ||
    ip.startsWith('100.')
  );
}

function startWebWizard(port = null) {
  const listenPort = parseInt(port || process.env.PORT || process.env.INSTALLER_PORT || '4000', 10);
  const rootDir = path.resolve(__dirname, '..');
  const checker = new SystemChecker({ rootDir });
  const configurator = new Configurator(rootDir);
  const migrator = new Migrator(rootDir);
  const compiler = new ProjectCompiler(rootDir);

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // API: Run preflight checks
    if (url.pathname === '/api/check' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', async () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const report = await checker.runAllChecks(
            payload.databaseUrl,
            payload.backendPort || 8585,
            payload.frontendPort || 3000
          );
          const compilerStatus = compiler.getStatus();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ...report, compilerStatus }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // API: Run installation
    if (url.pathname === '/api/install' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', async () => {
        try {
          const config = JSON.parse(body);

          // 1. Conditional Compilation (Only if needed)
          const compileResult = compiler.compileIfNeeded({
            force: Boolean(config.forceCompile),
            skip: Boolean(config.skipCompile),
          });

          // 2. Write environment files
          configurator.writeBackendEnv(config);
          configurator.writeFrontendEnv(config);

          // 3. Generate Prisma Client and Sync Schema
          migrator.generatePrismaClient();
          migrator.pushDatabaseSchema();

          // 4. Seed Data
          await migrator.seedInitialData(config);

          // 5. Lock installation
          configurator.createLockFile(config);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: true,
              message: 'Site installation and database configuration completed successfully!',
              compileResult,
              adminUrl: `http://localhost:${config.frontendPort || 3000}/${config.adminRoutePrefix || 'admin'}`,
              storeUrl: `http://localhost:${config.frontendPort || 3000}`,
            })
          );
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    // Serve HTML Wizard Page
    if (url.pathname === '/' || url.pathname === '/install') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(getWizardHtml(port));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(port, '0.0.0.0', async () => {
    const os = require('os');
    const actualPort = server.address()?.port || port;
    const publicIp = await fetchPublicIp();

    const publicCloudDomain =
      process.env.RENDER_EXTERNAL_URL ||
      (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null) ||
      (process.env.RAILWAY_STATIC_URL ? `https://${process.env.RAILWAY_STATIC_URL}` : null) ||
      (process.env.KOYEB_PUBLIC_DOMAIN ? `https://${process.env.KOYEB_PUBLIC_DOMAIN}` : null) ||
      (process.env.FLY_APP_NAME ? `https://${process.env.FLY_APP_NAME}.fly.dev` : null) ||
      (process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : null) ||
      process.env.PUBLIC_URL ||
      process.env.APP_URL ||
      process.env.HOST_URL;

    console.log(`
\x1b[38;5;214m\x1b[1m================================================================================\x1b[0m
\x1b[38;5;214m\x1b[1m      🌐 WOODEN MIR E-COMMERCE — WEB INSTALLATION WIZARD READY                  \x1b[0m
\x1b[38;5;214m\x1b[1m================================================================================\x1b[0m
`);

    if (publicCloudDomain) {
      const cleanUrl = publicCloudDomain.startsWith('http') ? publicCloudDomain : `https://${publicCloudDomain}`;
      console.log(`  \x1b[32m\x1b[1m👉 Public Cloud URL:\x1b[0m    \x1b[36m\x1b[4m${cleanUrl}\x1b[0m`);
    }

    if (publicIp) {
      console.log(`  \x1b[32m\x1b[1m👉 Public Server IP:\x1b[0m    \x1b[36m\x1b[4mhttp://${publicIp}:${actualPort}\x1b[0m`);
    }

    console.log(`  \x1b[33m\x1b[1m👉 Cloud Service URL:\x1b[0m   Open the Public Domain assigned in your Cloud Dashboard`);
    console.log(`     • Localhost:          \x1b[36mhttp://localhost:${actualPort}\x1b[0m`);

    try {
      const ifaces = os.networkInterfaces();
      for (const ifaceName of Object.keys(ifaces)) {
        for (const net of ifaces[ifaceName] || []) {
          if (net.family === 'IPv4' && !net.internal) {
            const isPriv = isPrivateIp(net.address);
            console.log(`     • ${ifaceName} (${isPriv ? 'Private Container IP' : 'Network IP'}): http://${net.address}:${actualPort}`);
          }
        }
      }
    } catch {}

    console.log(`
\x1b[90m  (Open your public domain or public IP in your browser to complete setup)\x1b[0m
`);
  });

  return server;
}

function getWizardHtml(port) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wooden Mir E-Commerce - 1st Run Installation Wizard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; }
    .gold-gradient { background: linear-gradient(135deg, #c08a46 0%, #a87435 100%); }
    .gold-border { border-color: #c08a46; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 sm:p-8">
  <div class="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
    <!-- Header -->
    <div class="p-6 sm:p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
          W
        </div>
        <div>
          <h1 class="text-xl font-bold text-white tracking-tight">Wooden Mir Full-Site Setup Wizard</h1>
          <p class="text-xs text-slate-400 mt-0.5">Automated First-Run Hosting Compatibility & Smart Compilation Provisioner</p>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        v2.0 Production
      </span>
    </div>

    <!-- Stepper Navigation -->
    <div class="grid grid-cols-4 border-b border-slate-800 text-xs font-bold text-center bg-slate-950/20">
      <button id="tab-btn-1" onclick="switchTab(1)" class="py-3.5 border-b-2 border-[#c08a46] text-[#c08a46] transition-all">1. Environment</button>
      <button id="tab-btn-2" onclick="switchTab(2)" class="py-3.5 border-b-2 border-transparent text-slate-400 hover:text-white transition-all">2. Database</button>
      <button id="tab-btn-3" onclick="switchTab(3)" class="py-3.5 border-b-2 border-transparent text-slate-400 hover:text-white transition-all">3. Store & Admin</button>
      <button id="tab-btn-4" onclick="switchTab(4)" class="py-3.5 border-b-2 border-transparent text-slate-400 hover:text-white transition-all">4. Finish & Install</button>
    </div>

    <!-- Wizard Content Body -->
    <div class="p-6 sm:p-8">
      <!-- Step 1: Preflight Compatibility -->
      <div id="step-1" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-white">Hosting & Server Pre-flight Inspection</h2>
            <p class="text-xs text-slate-400 mt-1">Verifying runtime versions, pre-compiled build artifacts, ports, and directory permissions.</p>
          </div>
          <button onclick="runPreflight()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700">
            Re-scan Environment
          </button>
        </div>

        <div id="preflight-list" class="space-y-3">
          <div class="p-6 text-center text-slate-400 text-xs">Scanning environment...</div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-800">
          <button onclick="switchTab(2)" class="px-6 py-2.5 rounded-xl gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider shadow">
            Next: Database Setup &rarr;
          </button>
        </div>
      </div>

      <!-- Step 2: Database Setup -->
      <div id="step-2" class="space-y-6 hidden">
        <div>
          <h2 class="text-base font-bold text-white">PostgreSQL Database Configuration</h2>
          <p class="text-xs text-slate-400 mt-1">Specify your target PostgreSQL server credentials or connection URI.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-300 mb-1">DB Host</label>
            <input type="text" id="db-host" value="localhost" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">DB Port</label>
            <input type="number" id="db-port" value="5433" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">DB Username</label>
            <input type="text" id="db-user" value="postgres" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">DB Password</label>
            <input type="password" id="db-pass" value="postgres" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-300 mb-1">Database Name</label>
            <input type="text" id="db-name" value="woodenmap" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
        </div>

        <div class="flex justify-between pt-4 border-t border-slate-800">
          <button onclick="switchTab(1)" class="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">&larr; Back</button>
          <button onclick="switchTab(3)" class="px-6 py-2.5 rounded-xl gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider shadow">Next: Store & Admin &rarr;</button>
        </div>
      </div>

      <!-- Step 3: Store & Admin -->
      <div id="step-3" class="space-y-6 hidden">
        <div>
          <h2 class="text-base font-bold text-white">Store Identity & Super Administrator Credentials</h2>
          <p class="text-xs text-slate-400 mt-1">Configure your branding and master administrator login.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-300 mb-1">Store Name</label>
            <input type="text" id="store-name" value="3D Wooden World Map" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">Admin Full Name</label>
            <input type="text" id="admin-name" value="Administrator" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">Admin Email Address</label>
            <input type="email" id="admin-email" value="admin@woodenmap.com" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">Admin Master Password</label>
            <input type="password" id="admin-pass" value="admin123" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">Delivery Inside Dhaka (৳)</label>
            <input type="number" id="del-inside" value="60" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">Delivery Outside Dhaka (৳)</label>
            <input type="number" id="del-outside" value="120" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#c08a46]" />
          </div>
        </div>

        <div class="flex justify-between pt-4 border-t border-slate-800">
          <button onclick="switchTab(2)" class="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">&larr; Back</button>
          <button onclick="switchTab(4)" class="px-6 py-2.5 rounded-xl gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider shadow">Next: Review & Install &rarr;</button>
        </div>
      </div>

      <!-- Step 4: Finish & Execute Installation -->
      <div id="step-4" class="space-y-6 hidden">
        <div>
          <h2 class="text-base font-bold text-white">Execute Final Site Provisioning</h2>
          <p class="text-xs text-slate-400 mt-1">Review deployment summary and trigger automated compilation (only if needed), database synchronization, and initial seeding.</p>
        </div>

        <div id="install-summary" class="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <!-- Populated by JS -->
        </div>

        <div id="install-progress" class="hidden space-y-3">
          <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div id="progress-bar" class="gold-gradient h-2.5 rounded-full transition-all duration-300" style="width: 35%"></div>
          </div>
          <p id="progress-text" class="text-xs text-slate-400 font-mono text-center">Checking compilation and provisioning database...</p>
        </div>

        <div id="install-result" class="hidden p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs space-y-3">
          <div class="font-bold text-sm">🎉 Full Site Installation Completed Successfully!</div>
          <p class="text-slate-300">Your site configuration is complete, database populated, and security lockfile activated.</p>
          <div class="flex items-center gap-3 pt-2">
            <a id="res-admin-link" href="#" target="_blank" class="px-5 py-2.5 rounded-xl gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider shadow inline-block">
              Open Admin Panel &rarr;
            </a>
            <a id="res-store-link" href="#" target="_blank" class="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs inline-block">
              Visit Live Store
            </a>
          </div>
        </div>

        <div id="action-buttons" class="flex justify-between pt-4 border-t border-slate-800">
          <button onclick="switchTab(3)" class="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">&larr; Back</button>
          <button id="btn-start-install" onclick="startInstallation()" class="px-8 py-3 rounded-xl gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider shadow cursor-pointer">
            🚀 Complete Setup & Install Site
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentTab = 1;
    let cachedCompilerStatus = null;

    function switchTab(tab) {
      for (let i = 1; i <= 4; i++) {
        document.getElementById('step-' + i).classList.add('hidden');
        document.getElementById('tab-btn-' + i).className = 'py-3.5 border-b-2 border-transparent text-slate-400 hover:text-white transition-all';
      }
      document.getElementById('step-' + tab).classList.remove('hidden');
      document.getElementById('tab-btn-' + tab).className = 'py-3.5 border-b-2 border-[#c08a46] text-[#c08a46] transition-all';
      currentTab = tab;

      if (tab === 4) {
        updateSummary();
      }
    }

    async function runPreflight() {
      const container = document.getElementById('preflight-list');
      container.innerHTML = '<div class="p-6 text-center text-slate-400 text-xs">Scanning hosting environment...</div>';

      try {
        const res = await fetch('/api/check', { method: 'POST' });
        const data = await res.json();
        cachedCompilerStatus = data.compilerStatus;
        
        let html = '';
        data.results.forEach(r => {
          const isPass = r.status === 'PASS';
          const isWarn = r.status === 'WARN';
          const badgeClass = isPass ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isWarn ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';
          const badgeText = isPass ? '✓ PASS' : isWarn ? '⚠ WARN' : '✗ FAIL';

          html += \`
            <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 text-xs">
              <div>
                <div class="font-bold text-slate-200">\${r.name}</div>
                <div class="text-slate-400 text-[11px] mt-0.5">\${r.message}</div>
              </div>
              <span class="px-2.5 py-0.5 rounded-md font-bold text-[10px] border \${badgeClass} shrink-0">\${badgeText}</span>
            </div>
          \`;
        });
        container.innerHTML = html;
      } catch (err) {
        container.innerHTML = '<div class="p-4 text-red-400 text-xs">Preflight check failed: ' + err.message + '</div>';
      }
    }

    function updateSummary() {
      const host = document.getElementById('db-host').value;
      const port = document.getElementById('db-port').value;
      const db = document.getElementById('db-name').value;
      const store = document.getElementById('store-name').value;
      const admin = document.getElementById('admin-email').value;

      const compileStatusText = cachedCompilerStatus && cachedCompilerStatus.allCompiled
        ? '<strong class="text-emerald-400">Pre-compiled (Build skipped)</strong>'
        : '<strong class="text-amber-400">Auto-compile on finish</strong>';

      document.getElementById('install-summary').innerHTML = \`
        <div class="grid grid-cols-2 gap-2">
          <div><span class="text-slate-500">Store Name:</span> <strong class="text-slate-200">\${store}</strong></div>
          <div><span class="text-slate-500">Super Admin:</span> <strong class="text-slate-200">\${admin}</strong></div>
          <div><span class="text-slate-500">Database Target:</span> <strong class="text-slate-200">\${host}:\${port}/\${db}</strong></div>
          <div><span class="text-slate-500">Build Strategy:</span> \${compileStatusText}</div>
        </div>
      \`;
    }

    async function startInstallation() {
      const btn = document.getElementById('btn-start-install');
      btn.disabled = true;
      btn.innerText = 'Installing...';

      document.getElementById('install-progress').classList.remove('hidden');

      const payload = {
        storeName: document.getElementById('store-name').value,
        adminName: document.getElementById('admin-name').value,
        adminEmail: document.getElementById('admin-email').value,
        adminPassword: document.getElementById('admin-pass').value,
        databaseUrl: 'postgresql://' + encodeURIComponent(document.getElementById('db-user').value) + ':' + encodeURIComponent(document.getElementById('db-pass').value) + '@' + document.getElementById('db-host').value + ':' + document.getElementById('db-port').value + '/' + document.getElementById('db-name').value + '?schema=public',
        deliveryInside: document.getElementById('del-inside').value,
        deliveryOutside: document.getElementById('del-outside').value,
        backendPort: 8585,
        frontendPort: 3000,
        enableCod: true,
        enableBkash: true
      };

      try {
        const res = await fetch('/api/install', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (result.success) {
          document.getElementById('install-progress').classList.add('hidden');
          document.getElementById('install-result').classList.remove('hidden');
          document.getElementById('action-buttons').classList.add('hidden');
          document.getElementById('res-admin-link').href = result.adminUrl;
          document.getElementById('res-store-link').href = result.storeUrl;
        } else {
          alert('Installation Error: ' + (result.error || 'Failed to complete installation'));
          btn.disabled = false;
          btn.innerText = 'Retry Installation';
        }
      } catch (err) {
        alert('Network or Server Error: ' + err.message);
        btn.disabled = false;
        btn.innerText = 'Retry Installation';
      }
    }

    // Auto-run preflight on load
    runPreflight();
  </script>
</body>
</html>`;
}

module.exports = { startWebWizard };

#!/usr/bin/env node

/**
 * 🚀 StoreForge Platform — Production Launcher
 *
 * Runs all StoreForge microservices in the background (detached daemon mode)
 * by default, allowing the terminal session to close while the services stay alive.
 *
 * Supports:
 * - node start                  (Runs detached in background, terminal is free)
 * - node start --foreground     (Runs attached in current terminal)
 * - node start -f               (Short flag for foreground mode)
 * - node start --backend-only   (Runs backend only)
 * - node start --frontend-only  (Runs storefront only)
 * - node start --admin-only     (Runs admin portal only)
 * - node stop                   (Stops all background services and frees ports)
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn, execSync } = require('child_process');

const rootDir = __dirname;

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  gold: '\x1b[38;5;214m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

/**
 * Single Central .env Loader
 */
function loadEnvFiles() {
  const rootEnvFiles = [
    path.join(rootDir, '.env.local'),
    path.join(rootDir, '.env'),
  ];

  for (const envPath of rootEnvFiles) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || line.startsWith('#')) continue;
          const eqIdx = line.indexOf('=');
          if (eqIdx <= 0) continue;

          const key = line.slice(0, eqIdx).trim();
          let val = line.slice(eqIdx + 1).trim();
          if (val.startsWith('"')) {
            const endIdx = val.indexOf('"', 1);
            val = endIdx !== -1 ? val.slice(1, endIdx) : val.slice(1);
          } else if (val.startsWith("'")) {
            const endIdx = val.indexOf("'", 1);
            val = endIdx !== -1 ? val.slice(1, endIdx) : val.slice(1);
          } else {
            const commentIdx = val.indexOf('#');
            if (commentIdx !== -1) {
              val = val.slice(0, commentIdx).trim();
            }
          }
          if (key && (process.env[key] === undefined || process.env[key] === '')) {
            process.env[key] = val;
          }
        }
      } catch {}
    }
  }
}

loadEnvFiles();

/**
 * Check if a PID is alive
 */
function isPidAlive(pid) {
  if (!pid || isNaN(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

const args = process.argv.slice(2);
const isDaemonChild = args.includes('--daemon-child');
const isForeground =
  args.includes('--foreground') ||
  args.includes('-f') ||
  args.includes('--fg') ||
  process.env.FOREGROUND === 'true' ||
  process.env.pm_id !== undefined ||
  process.env.PM2_HOME !== undefined ||
  process.env.PASSENGER_APP_ENV !== undefined;

const pidFilePath = path.join(rootDir, '.pids.json');

// If checking from terminal (not daemon child and not foreground), verify if already running
if (!isDaemonChild && !isForeground) {
  if (fs.existsSync(pidFilePath)) {
    try {
      const savedPids = JSON.parse(fs.readFileSync(pidFilePath, 'utf8'));
      const supervisorAlive = isPidAlive(savedPids?.supervisor);
      const backendAlive = isPidAlive(savedPids?.services?.backend?.pid);
      const frontendAlive = isPidAlive(savedPids?.services?.frontend?.pid);
      const adminAlive = isPidAlive(savedPids?.services?.admin?.pid);

      if (supervisorAlive || backendAlive || frontendAlive || adminAlive) {
        const port = process.env.PORT || '3000';
        const adminPort = process.env.ADMIN_PORT || '4000';
        const backendPort = process.env.BACKEND_PORT || '8585';
        const isBackend = args.includes('--backend-only') || args.includes('--backend');
        const isFrontend = args.includes('--frontend-only') || args.includes('--frontend');
        const isAdmin = args.includes('--admin-only') || args.includes('--admin');
        const isTargeted = isBackend || isFrontend || isAdmin;

        const displayFrontend = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_STORE_URL || `http://localhost:${port}`;
        const displayAdmin = process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL || `http://localhost:${adminPort}`;
        const displayBackend = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || `http://localhost:${backendPort}`;

        console.log(`\n${C.yellow}⚠️  StoreForge is already running!${C.reset}`);
        if (!isTargeted || isFrontend) console.log(`  ${C.bold}• Customer Storefront:${C.reset}   ${C.cyan}${displayFrontend}${C.reset}`);
        if (!isTargeted || isAdmin) console.log(`  ${C.bold}• Dedicated Admin Portal:${C.reset} ${C.magenta}${displayAdmin}${C.reset}`);
        if (!isTargeted || isBackend) console.log(`  ${C.bold}• Backend REST API:${C.reset}      ${C.cyan}${displayBackend.replace(/\/+$/, '')}/api${C.reset}`);
        console.log(`\n  ${C.gray}• Real-time logs:${C.reset}  ${C.cyan}tail -f logs/server.log${C.reset}`);
        console.log(`  ${C.gray}• Stop server:${C.reset}     ${C.bold}node stop${C.reset}\n`);
        process.exit(0);
      }
    } catch {}
  }
}

// 1. Check if any critical dependencies or node_modules are missing
const hasNest =
  fs.existsSync(path.join(rootDir, 'backend', 'node_modules', '@nestjs', 'core')) ||
  fs.existsSync(path.join(rootDir, 'node_modules', '@nestjs', 'core'));
const hasNext =
  fs.existsSync(path.join(rootDir, 'frontend', 'node_modules', 'next')) ||
  fs.existsSync(path.join(rootDir, 'node_modules', 'next'));
const hasPrisma =
  fs.existsSync(path.join(rootDir, 'backend', 'node_modules', '@prisma', 'client')) ||
  fs.existsSync(path.join(rootDir, 'node_modules', '@prisma', 'client'));
const hasRootModules = fs.existsSync(path.join(rootDir, 'node_modules'));

if (!hasRootModules || !hasNest || !hasNext || !hasPrisma) {
  console.log(`\n${C.gold}${C.bold}📦 Missing dependencies detected. Automatically installing...${C.reset}\n`);
  try {
    execSync('npm install --omit=dev', { cwd: rootDir, stdio: 'inherit' });
    console.log(`\n${C.green}✔ Dependencies successfully installed.${C.reset}\n`);
  } catch (err) {
    console.warn(`\n${C.yellow}⚠️ Retrying with npm install...${C.reset}\n`);
    try {
      execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
      console.log(`\n${C.green}✔ Dependencies installed.${C.reset}\n`);
    } catch (err2) {
      console.error(`\n${C.red}✖ Failed to auto-install dependencies:${C.reset}`, err2.message);
    }
  }
}

// If this is the background child process or foreground execution requested, hand off to start-server.js
if (isDaemonChild || isForeground) {
  // Strip --daemon-child so child script gets pristine arguments
  process.argv = process.argv.filter((arg) => arg !== '--daemon-child');
  require('./scripts/start-server.js');
} else {
  // Background daemon launcher
  (async function launchBackgroundDaemon() {
    const port = process.env.PORT || '3000';
    const adminPort = process.env.ADMIN_PORT || '4000';
    const backendPort = process.env.BACKEND_PORT || '8585';

    const isBackend = args.includes('--backend-only') || args.includes('--backend');
    const isFrontend = args.includes('--frontend-only') || args.includes('--frontend');
    const isAdmin = args.includes('--admin-only') || args.includes('--admin');
    const isTargeted = isBackend || isFrontend || isAdmin;

    // 2. Ensure logs directory exists
    const logsDir = path.join(rootDir, 'logs');
    if (!fs.existsSync(logsDir)) {
      try {
        fs.mkdirSync(logsDir, { recursive: true });
      } catch {}
    }

    const logFile = path.join(logsDir, 'server.log');
    const logFd = fs.openSync(logFile, 'a');

    // 3. Spawn background supervisor process completely detached
    const child = spawn(
      process.execPath,
      [path.join(rootDir, 'start.js'), '--daemon-child', ...args],
      {
        cwd: rootDir,
        detached: true,
        stdio: ['ignore', logFd, logFd],
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' },
      }
    );

    // Write initial PID file so `node stop` knows about this process immediately
    try {
      fs.writeFileSync(
        pidFilePath,
        JSON.stringify(
          {
            supervisor: child.pid,
            startedAt: new Date().toISOString(),
            mode: isTargeted ? 'single-service' : 'cluster',
          },
          null,
          2
        )
      );
    } catch {}

    fs.closeSync(logFd);
    child.unref();

    // 4. Wait a short moment to ensure process booted successfully
    await new Promise((r) => setTimeout(r, 1200));

    if (!isPidAlive(child.pid)) {
      console.error(`\n${C.red}✖ Server failed to start in the background.${C.reset}`);
      console.error(`  ${C.yellow}Check logs/server.log for details:${C.reset}\n`);
      try {
        const errorContent = fs.readFileSync(logFile, 'utf8');
        const lines = errorContent.trim().split('\n');
        console.error(lines.slice(-15).join('\n'));
      } catch {}
      process.exit(1);
    }

    const displayFrontend = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_STORE_URL || `http://localhost:${port}`;
    const displayAdmin = process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL || `http://localhost:${adminPort}`;
    const displayBackend = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || `http://localhost:${backendPort}`;

    console.log(`
${C.green}${C.bold}================================================================================${C.reset}
${C.green}${C.bold}         🛍️  STOREFORGE PLATFORM — BACKGROUND SERVER RUNNING                    ${C.reset}
${C.green}${C.bold}================================================================================${C.reset}

  ${C.green}✨ Server successfully launched in the background (PID: ${child.pid}).${C.reset}
  ${C.gray}Your terminal session is free. You can safely close this terminal window!${C.reset}
`);

    if (!isTargeted || isFrontend) {
      console.log(`  ${C.bold}• Customer Storefront:${C.reset}   ${C.cyan}${displayFrontend}${C.reset}`);
    }
    if (!isTargeted || isAdmin) {
      console.log(`  ${C.bold}• Dedicated Admin Portal:${C.reset} ${C.magenta}${displayAdmin}${C.reset}`);
    }
    if (!isTargeted || isBackend) {
      console.log(`  ${C.bold}• Backend REST API:${C.reset}      ${C.cyan}${displayBackend.replace(/\/+$/, '')}/api${C.reset}`);
    }

    console.log(`
  ${C.bold}📄 Real-time Logs:${C.reset}       ${C.cyan}tail -f logs/server.log${C.reset}
  ${C.bold}🛑 Stop Server:${C.reset}          ${C.yellow}${C.bold}node stop${C.reset}
${C.green}${C.bold}================================================================================${C.reset}
`);
    process.exit(0);
  })();
}

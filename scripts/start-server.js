#!/usr/bin/env node

/**
 * 🚀 StoreForge Engine — Production Bootstrapper & Lifecycle Manager
 *
 * Launches 3 independent micro-services:
 * - ⚙️  NestJS REST API Backend (port 8585 / $BACKEND_PORT)
 * - 🛍️  Next.js Storefront (port 3000 / $PORT)
 * - 🔐  Next.js Admin Portal (port 4000 / $ADMIN_PORT)
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const readline = require('readline');
const { spawn, execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

/**
 * Single Central .env Loader — reads ONLY from the project root
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

// Load root and workspace .env files immediately
loadEnvFiles();

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
 * Check if a port is currently available
 */
function isPortAvailable(port, host = '0.0.0.0') {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => {
        resolve(false);
      })
      .once('listening', () => {
        tester.once('close', () => resolve(true)).close();
      })
      .listen(port, host);
  });
}

/**
 * Find PIDs occupying a port
 */
function getPidsForPort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const lines = output.trim().split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid) && parseInt(pid, 10) > 0) pids.add(parseInt(pid, 10));
      }
      return Array.from(pids);
    } else {
      try {
        const output = execSync(`lsof -ti :${port} 2>/dev/null`, { encoding: 'utf8' });
        const pids = output
          .trim()
          .split('\n')
          .map((p) => parseInt(p.trim(), 10))
          .filter((p) => !isNaN(p) && p !== process.pid);
        if (pids.length > 0) return pids;
      } catch {}

      try {
        const output = execSync(`fuser ${port}/tcp 2>/dev/null`, { encoding: 'utf8' });
        const pids = output
          .trim()
          .split(/\s+/)
          .map((p) => parseInt(p.trim(), 10))
          .filter((p) => !isNaN(p) && p !== process.pid);
        if (pids.length > 0) return pids;
      } catch {}

      return [];
    }
  } catch {
    return [];
  }
}

/**
 * Terminate a process by PID
 */
function killPid(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
    } else {
      process.kill(pid, 'SIGKILL');
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Ask user confirmation in interactive terminal
 */
function askUserPermission(question) {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      return resolve(true);
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      const ans = (answer || '').trim().toLowerCase();
      resolve(ans === '' || ans.startsWith('y'));
    });
  });
}

/**
 * Ensure ports are free, asking user permission if conflicting processes exist
 */
async function ensurePortsAvailable(ports, autoKill = false) {
  const occupiedPorts = [];

  for (const port of ports) {
    const isFree = await isPortAvailable(port);
    if (!isFree) {
      const pids = getPidsForPort(port);
      occupiedPorts.push({ port, pids });
    }
  }

  if (occupiedPorts.length === 0) return true;

  if (!autoKill) {
    console.log(`\n${C.gold}${C.bold}⚠️  PORT CONFLICT DETECTED:${C.reset}`);
    for (const item of occupiedPorts) {
      const pidStr = item.pids.length > 0 ? ` (PID: ${item.pids.join(', ')})` : '';
      console.log(`  ${C.red}• Port ${item.port} is already in use by another process${pidStr}${C.reset}`);
    }

    const promptText = `\n${C.cyan}?${C.reset} ${C.bold}Would you like to terminate the conflicting process(es) and free the port(s)?${C.reset} ${C.gray}(Y/n)${C.reset}: `;
    const shouldKill = await askUserPermission(promptText);

    if (!shouldKill) {
      console.log(
        `\n${C.yellow}Startup aborted by user. Please free ports ${ports.join(', ')} or configure alternative PORTs.${C.reset}\n`
      );
      process.exit(1);
    }
  }

  console.log(`${C.gold}🧹 Freeing port(s) ${occupiedPorts.map((o) => o.port).join(', ')}...${C.reset}`);
  for (const item of occupiedPorts) {
    for (const pid of item.pids) {
      killPid(pid);
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  for (const port of ports) {
    const isFree = await isPortAvailable(port);
    if (!isFree && process.platform !== 'win32') {
      try {
        execSync(`kill -9 $(lsof -t -i:${port}) 2>/dev/null || true`, { stdio: 'ignore' });
      } catch {}
    }
  }

  await new Promise((r) => setTimeout(r, 300));
  console.log(`${C.green}✔ Ports successfully freed.${C.reset}\n`);
  return true;
}

function ensureDependenciesInstalled() {
  const rootNodeModules = fs.existsSync(path.join(rootDir, 'node_modules'));
  const backendInstalled =
    fs.existsSync(path.join(rootDir, 'node_modules', '@nestjs', 'core')) ||
    fs.existsSync(path.join(rootDir, 'backend', 'node_modules', '@nestjs', 'core'));
  const nextInstalled =
    fs.existsSync(path.join(rootDir, 'node_modules', 'next')) ||
    fs.existsSync(path.join(rootDir, 'frontend', 'node_modules', 'next'));
  const prismaInstalled =
    fs.existsSync(path.join(rootDir, 'node_modules', '@prisma', 'client')) ||
    fs.existsSync(path.join(rootDir, 'backend', 'node_modules', '@prisma', 'client'));

  if (!rootNodeModules || !backendInstalled || !nextInstalled || !prismaInstalled) {
    console.log(
      `\n${C.gold}${C.bold}📦 Missing production dependencies detected. Automatically running npm install --omit=dev...${C.reset}`
    );
    try {
      execSync('npm install --omit=dev', { cwd: rootDir, stdio: 'inherit' });
      console.log(`${C.green}✔ Production dependencies successfully installed.${C.reset}\n`);
    } catch (err) {
      console.warn(
        `\n${C.yellow}⚠️  'npm install --omit=dev' warning. Retrying with 'npm install'...${C.reset}`
      );
      try {
        execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
        console.log(`${C.green}✔ Dependencies installed successfully.${C.reset}\n`);
      } catch (err2) {
        console.error(
          `\n${C.red}✖ Failed to auto-install dependencies: ${err2.message}${C.reset}\n`
        );
      }
    }
  }

  // Ensure Prisma client is generated
  const prismaSchemaPath = [
    path.join(rootDir, 'backend', 'prisma', 'schema.prisma'),
    path.join(rootDir, 'prisma', 'schema.prisma'),
  ].find((p) => fs.existsSync(p));

  const prismaClientGenerated =
    fs.existsSync(path.join(rootDir, 'node_modules', '.prisma', 'client', 'index.js')) ||
    fs.existsSync(path.join(rootDir, 'backend', 'node_modules', '.prisma', 'client', 'index.js'));

  if (prismaSchemaPath && !prismaClientGenerated) {
    console.log(`${C.gold}⚙️  Generating Prisma ORM client artifacts...${C.reset}`);
    try {
      execSync(`npx prisma generate --schema="${prismaSchemaPath}"`, {
        cwd: rootDir,
        stdio: 'inherit',
      });
      console.log(`${C.green}✔ Prisma client generated successfully.${C.reset}\n`);
    } catch (err) {
      console.error(`${C.red}✖ Prisma generate failed:${C.reset}`, err.message);
    }
  }
}

/**
 * Automatically synchronize database schema if DATABASE_URL is configured.
 * If the database was not configured properly on first run, this ensures that
 * on the second run (and any subsequent run) the database setup is re-executed
 * so all tables exist before microservices boot.
 */
function ensureDatabaseSchemaSynced() {
  loadEnvFiles();

  const prismaSchemaPath = [
    path.join(rootDir, 'backend', 'prisma', 'schema.prisma'),
    path.join(rootDir, 'prisma', 'schema.prisma'),
  ].find((p) => fs.existsSync(p));

  const databaseUrl = process.env.DATABASE_URL;

  if (prismaSchemaPath && databaseUrl) {
    const isWin = process.platform === 'win32';
    const prismaBin = [
      path.join(rootDir, 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma'),
      path.join(rootDir, 'backend', 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma'),
    ].find((p) => fs.existsSync(p));

    const prismaCmd = prismaBin ? `"${prismaBin}"` : 'npx prisma';

    console.log(`${C.gold}⚙️  Verifying & syncing database schema (prisma db push)...${C.reset}`);
    try {
      execSync(`${prismaCmd} db push --schema="${prismaSchemaPath}" --skip-generate`, {
        cwd: rootDir,
        stdio: 'inherit',
        env: { ...process.env },
      });
      console.log(`${C.green}✔ Database tables verified and ready.${C.reset}\n`);
    } catch (err) {
      console.warn(
        `\n${C.yellow}⚠️  Database auto-sync notice: Could not connect to PostgreSQL or sync tables.${C.reset}`
      );
      console.warn(
        `${C.yellow}   If PostgreSQL was not running on first run, it will automatically configure on the next run.${C.reset}\n`
      );
    }
  }
}

function resolveNextCommand(appDir, port) {
  const nextCliJs = [
    path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next'),
    path.join(appDir, 'node_modules', 'next', 'dist', 'bin', 'next'),
  ].find((p) => fs.existsSync(p));

  const isWin = process.platform === 'win32';
  const nextBin = [
    path.join(rootDir, 'node_modules', '.bin', isWin ? 'next.cmd' : 'next'),
    path.join(appDir, 'node_modules', '.bin', isWin ? 'next.cmd' : 'next'),
  ].find((p) => fs.existsSync(p));

  if (nextCliJs) {
    return { cmd: 'node', args: [nextCliJs, 'start', '-p', port] };
  } else if (nextBin) {
    return { cmd: nextBin, args: ['start', '-p', port] };
  } else {
    return { cmd: 'npx', args: ['next', 'start', '-p', port] };
  }
}

/**
 * Start the fullstack production cluster (Backend + Storefront + Admin)
 */
async function startProductionCluster() {
  // 1. Ensure node_modules and Prisma client exist
  ensureDependenciesInstalled();

  // 2. Ensure database tables exist and are in sync
  ensureDatabaseSchemaSynced();

  const port = process.env.PORT || '3000';
  const adminPort = process.env.ADMIN_PORT || '4000';
  const backendPort = process.env.BACKEND_PORT || '8585';

  const portsToCheck = [
    parseInt(port, 10),
    parseInt(adminPort, 10),
    parseInt(backendPort, 10),
  ].filter((p) => !isNaN(p) && p > 0);

  if (portsToCheck.length > 0) {
    await ensurePortsAvailable(portsToCheck);
  }

  console.log(`
${C.green}${C.bold}================================================================================${C.reset}
${C.green}${C.bold}         🛍️  STOREFORGE PLATFORM — PRODUCTION CLUSTER RUNNING                    ${C.reset}
${C.green}${C.bold}================================================================================${C.reset}
`);

  console.log(`  ${C.bold}• Customer Storefront:${C.reset}   ${C.cyan}http://localhost:${port}${C.reset}`);
  console.log(`  ${C.bold}• Dedicated Admin Portal:${C.reset} ${C.magenta}http://localhost:${adminPort}${C.reset} ${C.gray}(Initial setup wizard on first launch)${C.reset}`);
  console.log(`  ${C.bold}• Backend REST API API:${C.reset}  ${C.cyan}http://localhost:${backendPort}/api${C.reset}\n`);

  // 1. Spawn NestJS Backend
  const backendDir = path.join(rootDir, 'backend');
  const backendEntry = fs.existsSync(path.join(backendDir, 'dist', 'src', 'main.js'))
    ? path.join('dist', 'src', 'main.js')
    : path.join('dist', 'main.js');

  const backendProc = spawn('node', [backendEntry], {
    cwd: backendDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', PORT: backendPort },
  });

  // 2. Spawn Next.js Storefront (Port 3000)
  const frontendDir = path.join(rootDir, 'frontend');
  const frontendExec = resolveNextCommand(frontendDir, port);

  const frontendProc = spawn(frontendExec.cmd, frontendExec.args, {
    cwd: frontendDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', PORT: port },
  });

  // 3. Spawn Next.js Admin Portal (Port 4000)
  const adminDir = path.join(rootDir, 'admin');
  const adminExec = resolveNextCommand(adminDir, adminPort);

  const adminProc = spawn(adminExec.cmd, adminExec.args, {
    cwd: adminDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', PORT: adminPort },
  });

  backendProc.on('error', (err) => {
    console.error(`${C.red}Backend Process Error:${C.reset}`, err.message);
  });

  frontendProc.on('error', (err) => {
    console.error(`${C.red}Frontend Storefront Error:${C.reset}`, err.message);
  });

  adminProc.on('error', (err) => {
    console.error(`${C.red}Admin Portal Error:${C.reset}`, err.message);
  });

  // Handle process lifecycle & termination
  const cleanup = () => {
    try {
      backendProc.kill('SIGTERM');
    } catch {}
    try {
      frontendProc.kill('SIGTERM');
    } catch {}
    try {
      adminProc.kill('SIGTERM');
    } catch {}
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

startProductionCluster().catch((err) => {
  console.error(`${C.red}Fatal Startup Error:${C.reset}`, err);
  process.exit(1);
});

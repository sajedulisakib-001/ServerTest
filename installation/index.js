#!/usr/bin/env node

const path = require('path');
const readline = require('readline');
const { SystemChecker } = require('./checker');
const { Configurator } = require('./configurator');
const { Migrator } = require('./migrator');
const { ProjectCompiler } = require('./compiler');
const { startWebWizard } = require('./web-wizard');

const rootDir = path.resolve(__dirname, '..');
const checker = new SystemChecker({ rootDir });
const configurator = new Configurator(rootDir);
const migrator = new Migrator(rootDir);
const compiler = new ProjectCompiler(rootDir);

// ANSI Color Helpers
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  gold: '\x1b[38;5;214m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function printBanner() {
  console.log(`
${C.gold}${C.bold}================================================================================${C.reset}
${C.gold}${C.bold}        WOODEN MIR E-COMMERCE — FIRST-RUN SITE INSTALLER & AUDITOR              ${C.reset}
${C.gray}        Automated Hosting Compatibility, Smart Compilation & RBAC Setup         ${C.reset}
${C.gold}${C.bold}================================================================================${C.reset}
`);
}

async function prompt(rl, question, defaultValue = '') {
  return new Promise((resolve) => {
    const promptText = defaultValue
      ? `${C.cyan}?${C.reset} ${C.bold}${question}${C.reset} ${C.gray}(default: ${defaultValue})${C.reset}: `
      : `${C.cyan}?${C.reset} ${C.bold}${question}${C.reset}: `;

    rl.question(promptText, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function runCli() {
  const args = process.argv.slice(2);
  const isWeb = args.includes('--web');
  const isCheckOnly = args.includes('--check-only');
  const isQuick = args.includes('--quick') || args.includes('-y');
  const isForce = args.includes('--force');
  const forceCompile = args.includes('--force-compile') || args.includes('--compile');
  const skipCompile = args.includes('--skip-compile') || args.includes('--no-compile');

  printBanner();

  // 1. Web Wizard Option
  if (isWeb) {
    const port = parseInt(process.env.INSTALLER_PORT || '4000', 10);
    startWebWizard(port);
    return;
  }

  // 2. Preflight Compatibility Audit
  console.log(`${C.bold}🔍 Running Hosting & Environment Compatibility Pre-flight Audit...${C.reset}\n`);
  const report = await checker.runAllChecks(process.env.DATABASE_URL, 8585, 3000);

  report.results.forEach((r) => {
    let icon = `${C.green}✔ PASS${C.reset}`;
    if (r.status === 'WARN') icon = `${C.yellow}⚠ WARN${C.reset}`;
    if (r.status === 'FAIL') icon = `${C.red}✖ FAIL${C.reset}`;

    console.log(`  [${icon}] ${C.bold}${r.name}${C.reset}`);
    console.log(`         ${C.gray}${r.message}${C.reset}`);
  });

  console.log('');

  if (isCheckOnly) {
    console.log(
      report.compatible
        ? `${C.green}${C.bold}✔ System is compatible and ready for installation.${C.reset}\n`
        : `${C.red}${C.bold}✖ System compatibility checks failed. Please address errors above.${C.reset}\n`
    );
    process.exit(report.compatible ? 0 : 1);
  }

  // Check Lockfile
  const lockCheck = report.results.find((r) => r.name === 'Installation Lock Status');
  if (lockCheck && lockCheck.status === 'WARN' && !isForce) {
    console.log(
      `${C.yellow}${C.bold}🔒 Site is already locked and marked as installed.${C.reset}`
    );
    console.log(
      `${C.gray}To re-run setup and override, execute: ${C.bold}npm run install:wizard -- --force${C.reset}\n`
    );
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    let config = {};

    if (isQuick) {
      console.log(`${C.gold}⚡ Quick Installation Mode: Applying production defaults...${C.reset}\n`);
      config = {
        storeName: '3D Wooden World Map',
        adminName: 'Administrator',
        adminEmail: 'admin@woodenmap.com',
        adminPassword: 'admin123',
        databaseUrl:
          process.env.DATABASE_URL ||
          'postgresql://postgres:postgres@localhost:5433/woodenmap?schema=public',
        deliveryInside: '60',
        deliveryOutside: '120',
        backendPort: 8585,
        frontendPort: 3000,
        enableCod: true,
        enableBkash: true,
      };
    } else {
      console.log(`${C.bold}📋 Step 1: PostgreSQL Database Configuration${C.reset}`);
      const dbHost = await prompt(rl, 'Database Host', 'localhost');
      const dbPort = await prompt(rl, 'Database Port', '5433');
      const dbUser = await prompt(rl, 'Database Username', 'postgres');
      const dbPass = await prompt(rl, 'Database Password', 'postgres');
      const dbName = await prompt(rl, 'Database Name', 'woodenmap');

      const dbUrl = configurator.buildDatabaseUrl({
        host: dbHost,
        port: parseInt(dbPort, 10),
        user: dbUser,
        password: dbPass,
        database: dbName,
        schema: 'public',
      });

      console.log(`\n${C.bold}📋 Step 2: Store Identity & Delivery Details${C.reset}`);
      const storeName = await prompt(rl, 'Store / Brand Name', '3D Wooden World Map');
      const deliveryInside = await prompt(rl, 'Delivery Charge Inside Dhaka (৳)', '60');
      const deliveryOutside = await prompt(rl, 'Delivery Charge Outside Dhaka (৳)', '120');

      console.log(`\n${C.bold}📋 Step 3: Super Administrator Account Credentials${C.reset}`);
      const adminName = await prompt(rl, 'Master Admin Name', 'Administrator');
      const adminEmail = await prompt(rl, 'Master Admin Email', 'admin@woodenmap.com');
      const adminPassword = await prompt(rl, 'Master Admin Password', 'admin123');

      console.log(`\n${C.bold}📋 Step 4: Network & Gateway Ports${C.reset}`);
      const backendPort = await prompt(rl, 'Backend API Port', '8585');
      const frontendPort = await prompt(rl, 'Frontend Web App Port', '3000');

      config = {
        storeName,
        adminName,
        adminEmail,
        adminPassword,
        databaseUrl: dbUrl,
        deliveryInside,
        deliveryOutside,
        backendPort: parseInt(backendPort, 10),
        frontendPort: parseInt(frontendPort, 10),
        enableCod: true,
        enableBkash: true,
      };
    }

    rl.close();

    console.log(`\n${C.bold}🚀 Starting Automated Provisioning Pipeline...${C.reset}\n`);

    // 1. Conditional Compilation Step (Only if needed)
    console.log(`  ${C.bold}[1/5] Checking project compilation status...${C.reset}`);
    const compStatus = compiler.getStatus();

    if (skipCompile) {
      console.log(`        ${C.gray}⏩ Skipping compilation (--skip-compile requested).${C.reset}`);
    } else {
      // Backend check
      if (compStatus.backend.compiled && !forceCompile) {
        console.log(`        ${C.green}✔ Backend already compiled (backend/dist ready) - Skipping compilation.${C.reset}`);
      } else {
        process.stdout.write(`        🔨 Compiling NestJS Backend (${C.cyan}npm run build --workspace=backend${C.reset})... `);
        const bRes = compiler.compileBackend(forceCompile);
        console.log(`${C.green}Done (${bRes.durationSec}s).${C.reset}`);
      }

      // Frontend check
      if (compStatus.frontend.compiled && !forceCompile) {
        console.log(`        ${C.green}✔ Frontend already compiled (frontend/.next ready) - Skipping compilation.${C.reset}`);
      } else {
        process.stdout.write(`        🔨 Compiling Next.js Frontend (${C.cyan}npm run build --workspace=frontend${C.reset})... `);
        const fRes = compiler.compileFrontend(forceCompile);
        console.log(`${C.green}Done (${fRes.durationSec}s).${C.reset}`);
      }
    }

    // 2. Write environment files
    process.stdout.write(`  ${C.bold}[2/5] Generating environment configuration files...${C.reset} `);
    configurator.writeBackendEnv(config);
    configurator.writeFrontendEnv(config);
    console.log(`${C.green}Done.${C.reset}`);

    // 3. Generate Prisma Client
    process.stdout.write(`  ${C.bold}[3/5] Generating Prisma ORM Client...${C.reset} `);
    migrator.generatePrismaClient();
    console.log(`${C.green}Done.${C.reset}`);

    // 4. Push Database Schema
    process.stdout.write(`  ${C.bold}[4/5] Synchronizing PostgreSQL database schema...${C.reset} `);
    migrator.pushDatabaseSchema();
    console.log(`${C.green}Done.${C.reset}`);

    // 5. Seed initial database data
    process.stdout.write(`  ${C.bold}[5/5] Provisioning administrator, settings, and base catalog...${C.reset} `);
    await migrator.seedInitialData(config);
    console.log(`${C.green}Done.${C.reset}`);

    // 6. Create Lockfile
    configurator.createLockFile(config);

    const isPrecompiled = compiler.getStatus().allCompiled;

    console.log(`
${C.green}${C.bold}================================================================================${C.reset}
${C.green}${C.bold}         🎉 WOODEN MIR E-COMMERCE HAS BEEN INSTALLED SUCCESSFULLY!              ${C.reset}
${C.green}${C.bold}================================================================================${C.reset}

  ${C.bold}• Storefront URL:${C.reset}    ${C.cyan}http://localhost:${config.frontendPort || 3000}${C.reset}
  ${C.bold}• Admin Panel:${C.reset}       ${C.cyan}http://localhost:${config.frontendPort || 3000}/admin${C.reset}
  ${C.bold}• Admin Email:${C.reset}       ${C.yellow}${config.adminEmail}${C.reset}
  ${C.bold}• Admin Password:${C.reset}    ${C.yellow}${config.adminPassword}${C.reset}
  ${C.bold}• Backend API:${C.reset}       ${C.cyan}http://localhost:${config.backendPort || 8585}/api${C.reset}

  ${C.gray}Security Note: The installation lockfile has been placed at installation/installed.lock.${C.reset}
  ${C.gray}To launch your server, run:${C.reset} ${C.bold}${isPrecompiled ? 'npm run start' : 'npm run dev'}${C.reset}
`);
  } catch (err) {
    rl.close();
    console.error(`\n${C.red}${C.bold}✖ Installation Failed: ${err.message}${C.reset}\n`);
    process.exit(1);
  }
}

runCli();

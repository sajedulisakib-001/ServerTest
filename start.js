#!/usr/bin/env node

/**
 * 🚀 StoreForge Platform — Production Launcher
 *
 * Supports:
 * - node start
 * - node start.js
 * - ./start
 * - npm start
 * - node server.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;

// Check if any critical dependencies or node_modules are missing
const criticalModules = [
  path.join(rootDir, 'node_modules'),
  path.join(rootDir, 'node_modules', '@nestjs', 'core'),
  path.join(rootDir, 'node_modules', 'next'),
  path.join(rootDir, 'node_modules', '@prisma', 'client'),
];

const hasMissing = criticalModules.some((p) => !fs.existsSync(p));

if (hasMissing) {
  console.log('\n\x1b[38;5;214m\x1b[1m📦 Missing dependencies detected. Automatically running npm install --omit=dev...\x1b[0m\n');
  try {
    execSync('npm install --omit=dev', { cwd: rootDir, stdio: 'inherit' });
    console.log('\n\x1b[32m✔ Dependencies successfully installed.\x1b[0m\n');
  } catch (err) {
    console.warn('\n\x1b[33m⚠️ Retrying with npm install...\x1b[0m\n');
    try {
      execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
      console.log('\n\x1b[32m✔ Dependencies installed.\x1b[0m\n');
    } catch (err2) {
      console.error('\n\x1b[31m✖ Failed to auto-install dependencies:\x1b[0m', err2.message);
    }
  }
}

// Hand off to the production cluster server
require('./scripts/start-server.js');

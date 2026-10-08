const os = require('os');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { execSync } = require('child_process');

/**
 * System and Hosting Environment Compatibility Auditor
 */
class SystemChecker {
  constructor(options = {}) {
    this.rootDir = options.rootDir || path.resolve(__dirname, '..');
    this.results = [];
    this.hasErrors = false;
    this.hasWarnings = false;
  }

  logResult(name, status, message, details = null) {
    const item = { name, status, message, details };
    this.results.push(item);
    if (status === 'FAIL') this.hasErrors = true;
    if (status === 'WARN') this.hasWarnings = true;
    return item;
  }

  /**
   * 1. Check Node.js Runtime Version
   */
  checkNodeVersion() {
    const currentVersion = process.version;
    const major = parseInt(currentVersion.replace('v', '').split('.')[0], 10);
    const minor = parseInt(currentVersion.replace('v', '').split('.')[1], 10);

    if (major < 18) {
      return this.logResult(
        'Node.js Runtime',
        'FAIL',
        `Node.js version is ${currentVersion}. Minimum required is v18.0.0 (Recommended: v20 LTS or v22 LTS).`,
        { current: currentVersion, required: '>=18.0.0' }
      );
    }

    return this.logResult(
      'Node.js Runtime',
      'PASS',
      `Node.js ${currentVersion} is fully compatible and supported.`,
      { current: currentVersion, major, minor }
    );
  }

  /**
   * 2. Check Package Manager (npm / npx)
   */
  checkPackageManager() {
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8', timeout: 5000 }).trim();
      return this.logResult(
        'Package Manager (npm)',
        'PASS',
        `npm v${npmVersion} detected.`,
        { version: npmVersion }
      );
    } catch (err) {
      return this.logResult(
        'Package Manager (npm)',
        'FAIL',
        'npm is not available in the system PATH.',
        { error: err.message }
      );
    }
  }

  /**
   * 3. Check System Memory & Hardware Resources
   */
  checkSystemResources() {
    const totalMemBytes = os.totalmem();
    const freeMemBytes = os.freemem();
    const totalMemMB = Math.round(totalMemBytes / (1024 * 1024));
    const freeMemMB = Math.round(freeMemBytes / (1024 * 1024));
    const cpuCount = os.cpus().length;

    const compilerStatus = this.checkCompilationStatus();

    if (totalMemMB < 450) {
      return this.logResult(
        'Hardware Resources (RAM & CPU)',
        'WARN',
        `System has ${totalMemMB}MB RAM. Minimum 512MB RAM recommended for server execution.`,
        { totalMemMB, freeMemMB, cpuCount, precompiled: compilerStatus.allCompiled }
      );
    }

    return this.logResult(
      'Hardware Resources (RAM & CPU)',
      'PASS',
      compilerStatus.allCompiled
        ? `Pre-compiled build detected (${totalMemMB}MB Total RAM, ${cpuCount} CPU Cores). Only ~150MB RAM required at runtime (Zero build RAM overhead).`
        : `Sufficient hardware resources detected (${totalMemMB}MB Total RAM, ${freeMemMB}MB Available, ${cpuCount} CPU Cores).`,
      { totalMemMB, freeMemMB, cpuCount, precompiled: compilerStatus.allCompiled }
    );
  }

  /**
   * 3b. Check Pre-compiled vs Source Build Status
   */
  checkCompilationStatus() {
    const hasBackend =
      fs.existsSync(path.join(this.rootDir, 'backend', 'dist', 'src', 'main.js')) ||
      fs.existsSync(path.join(this.rootDir, 'backend', 'dist', 'main.js'));
    const hasFrontend =
      fs.existsSync(path.join(this.rootDir, 'frontend', '.next', 'BUILD_ID')) ||
      fs.existsSync(path.join(this.rootDir, 'frontend', '.next', 'standalone')) ||
      fs.existsSync(path.join(this.rootDir, 'frontend', '.next', 'server'));

    const allCompiled = hasBackend && hasFrontend;

    if (allCompiled) {
      return this.logResult(
        'Pre-compiled Asset Status',
        'PASS',
        'Production assets already compiled (backend/dist & frontend/.next present). Installer will skip build step.',
        { backendCompiled: true, frontendCompiled: true, allCompiled: true }
      );
    }

    const pending = [];
    if (!hasBackend) pending.push('NestJS Backend');
    if (!hasFrontend) pending.push('Next.js Frontend');

    return this.logResult(
      'Pre-compiled Asset Status',
      'WARN',
      `Source code mode detected (${pending.join(' & ')} pending). Installer will automatically compile before first run.`,
      { backendCompiled: hasBackend, frontendCompiled: hasFrontend, allCompiled: false }
    );
  }

  /**
   * 4. Check File System & Directory Write Permissions
   */
  checkDirectoryPermissions() {
    const dirsToCheck = [
      this.rootDir,
      path.join(this.rootDir, 'backend'),
      path.join(this.rootDir, 'frontend'),
      path.join(this.rootDir, 'backend', 'uploads'),
      path.join(this.rootDir, 'installation'),
    ];

    const failedDirs = [];

    for (const dir of dirsToCheck) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        // Test write ability
        const testFile = path.join(dir, `.perm_test_${Date.now()}`);
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
      } catch (err) {
        failedDirs.push({ dir, error: err.message });
      }
    }

    if (failedDirs.length > 0) {
      return this.logResult(
        'File System Permissions',
        'FAIL',
        `Write permissions failed in: ${failedDirs.map((f) => path.basename(f.dir)).join(', ')}. Please grant write access.`,
        { failedDirs }
      );
    }

    return this.logResult(
      'File System Permissions',
      'PASS',
      'All application directories and upload paths are writable.',
      { checkedPaths: dirsToCheck.length }
    );
  }

  /**
   * 5. Check Port Availability
   */
  async checkPortAvailability(port, host = '0.0.0.0') {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.unref();

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve({
            available: false,
            port,
            message: `Port ${port} is currently in use by another service.`,
          });
        } else {
          resolve({
            available: false,
            port,
            message: `Port ${port} error: ${err.message}`,
          });
        }
      });

      server.listen(port, host, () => {
        server.close(() => {
          resolve({
            available: true,
            port,
            message: `Port ${port} is available.`,
          });
        });
      });
    });
  }

  /**
   * 6. Check PostgreSQL Server Reachability
   */
  async checkDatabaseConnection(connectionUrl) {
    if (!connectionUrl) {
      return this.logResult(
        'Database Connectivity',
        'WARN',
        'No DATABASE_URL provided for preflight test. Skipping live DB probe.',
        null
      );
    }

    try {
      // Parse connection url
      const url = new URL(connectionUrl);
      const host = url.hostname || 'localhost';
      const port = parseInt(url.port || '5432', 10);

      const reachable = await new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3500);

        socket.on('connect', () => {
          socket.destroy();
          resolve(true);
        });

        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });

        socket.on('error', () => {
          socket.destroy();
          resolve(false);
        });

        socket.connect(port, host);
      });

      if (!reachable) {
        return this.logResult(
          'Database Connectivity',
          'FAIL',
          `Could not establish TCP connection to PostgreSQL server at ${host}:${port}. Please verify your DB service is running.`,
          { host, port }
        );
      }

      return this.logResult(
        'Database Connectivity',
        'PASS',
        `PostgreSQL server is reachable at ${host}:${port}.`,
        { host, port, database: url.pathname.replace('/', '') }
      );
    } catch (err) {
      return this.logResult(
        'Database Connectivity',
        'FAIL',
        `Invalid DATABASE_URL format: ${err.message}`,
        { error: err.message }
      );
    }
  }

  /**
   * 7. Check Lockfile (Prevent Accidental Overwrite)
   */
  checkInstallationLock() {
    const lockPath = path.join(this.rootDir, 'installation', 'installed.lock');
    const isLocked = fs.existsSync(lockPath);

    if (isLocked) {
      let lockData = {};
      try {
        lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      } catch {}

      return this.logResult(
        'Installation Lock Status',
        'WARN',
        `Application is already marked as INSTALLED on ${lockData.installed_at || 'earlier date'}. To re-run setup, use the --force flag or remove installation/installed.lock.`,
        { isLocked: true, lockData }
      );
    }

    return this.logResult(
      'Installation Lock Status',
      'PASS',
      'Clean state: No existing installation lockfile detected. Ready for initial setup.',
      { isLocked: false }
    );
  }

  /**
   * Run All System Checks
   */
  async runAllChecks(dbUrl = null, backendPort = 8585, frontendPort = 3000) {
    this.results = [];
    this.hasErrors = false;
    this.hasWarnings = false;

    this.checkInstallationLock();
    this.checkNodeVersion();
    this.checkPackageManager();
    this.checkSystemResources();
    this.checkDirectoryPermissions();

    // Check Ports
    const bPortCheck = await this.checkPortAvailability(backendPort);
    if (!bPortCheck.available) {
      this.logResult('Backend Port (8585)', 'WARN', bPortCheck.message, { port: backendPort });
    } else {
      this.logResult('Backend Port (8585)', 'PASS', `Port ${backendPort} is free and ready.`, { port: backendPort });
    }

    const fPortCheck = await this.checkPortAvailability(frontendPort);
    if (!fPortCheck.available) {
      this.logResult('Frontend Port (3000)', 'WARN', fPortCheck.message, { port: frontendPort });
    } else {
      this.logResult('Frontend Port (3000)', 'PASS', `Port ${frontendPort} is free and ready.`, { port: frontendPort });
    }

    if (dbUrl) {
      await this.checkDatabaseConnection(dbUrl);
    }

    return {
      compatible: !this.hasErrors,
      hasWarnings: this.hasWarnings,
      results: this.results,
    };
  }
}

module.exports = { SystemChecker };

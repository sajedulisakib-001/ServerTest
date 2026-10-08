const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Smart Conditional Project Compiler & Build Manager
 * Automatically detects whether backend (NestJS) and frontend (Next.js)
 * are already pre-compiled, and compiles ONLY if artifacts are missing or requested.
 */
class ProjectCompiler {
  constructor(rootDir = null) {
    this.rootDir = rootDir || path.resolve(__dirname, '..');
    this.backendDir = path.join(this.rootDir, 'backend');
    this.frontendDir = path.join(this.rootDir, 'frontend');
  }

  /**
   * Check if backend NestJS build output is ready
   */
  isBackendCompiled() {
    const mainPath = path.join(this.backendDir, 'dist', 'src', 'main.js');
    const altMainPath = path.join(this.backendDir, 'dist', 'main.js');
    return fs.existsSync(mainPath) || fs.existsSync(altMainPath);
  }

  /**
   * Check if frontend Next.js build output is ready
   */
  isFrontendCompiled() {
    const buildIdPath = path.join(this.frontendDir, '.next', 'BUILD_ID');
    const standaloneServer = path.join(this.frontendDir, '.next', 'standalone', 'frontend', 'server.js');
    const serverDir = path.join(this.frontendDir, '.next', 'server');

    return fs.existsSync(buildIdPath) || fs.existsSync(standaloneServer) || fs.existsSync(serverDir);
  }

  /**
   * Check if Prisma client engine is generated
   */
  isPrismaGenerated() {
    try {
      const rootClient = path.join(this.rootDir, 'node_modules', '.prisma', 'client', 'index.js');
      const backendClient = path.join(this.backendDir, 'node_modules', '.prisma', 'client', 'index.js');
      return fs.existsSync(rootClient) || fs.existsSync(backendClient);
    } catch {
      return false;
    }
  }

  /**
   * Get full compilation report
   */
  getStatus() {
    const backendCompiled = this.isBackendCompiled();
    const frontendCompiled = this.isFrontendCompiled();
    const prismaGenerated = this.isPrismaGenerated();

    return {
      backend: {
        compiled: backendCompiled,
        path: path.join(this.backendDir, 'dist'),
        hasSource: fs.existsSync(path.join(this.backendDir, 'src')),
      },
      frontend: {
        compiled: frontendCompiled,
        path: path.join(this.frontendDir, '.next'),
        hasSource: fs.existsSync(path.join(this.frontendDir, 'src')),
      },
      prisma: {
        generated: prismaGenerated,
      },
      allCompiled: backendCompiled && frontendCompiled,
      needsBackendCompile: !backendCompiled,
      needsFrontendCompile: !frontendCompiled,
    };
  }

  /**
   * Compile NestJS backend if needed or forced
   */
  compileBackend(force = false) {
    const isCompiled = this.isBackendCompiled();

    if (isCompiled && !force) {
      return {
        success: true,
        skipped: true,
        message: 'Backend already compiled (backend/dist ready). Skipping compilation.',
      };
    }

    const startTime = Date.now();
    try {
      execSync('npm run build --workspace=backend', {
        cwd: this.rootDir,
        stdio: 'pipe',
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024,
      });

      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
      return {
        success: true,
        skipped: false,
        durationSec,
        message: `NestJS backend successfully compiled in ${durationSec}s.`,
      };
    } catch (err) {
      // Attempt fallback directly inside backend directory
      try {
        execSync('npx nest build', {
          cwd: this.backendDir,
          stdio: 'pipe',
          encoding: 'utf8',
          maxBuffer: 10 * 1024 * 1024,
        });
        const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
        return {
          success: true,
          skipped: false,
          durationSec,
          message: `NestJS backend compiled via nest CLI in ${durationSec}s.`,
        };
      } catch (fallbackErr) {
        throw new Error(`Failed to compile NestJS Backend: ${fallbackErr.stderr || fallbackErr.message || err.message}`);
      }
    }
  }

  /**
   * Compile Next.js frontend if needed or forced
   */
  compileFrontend(force = false) {
    const isCompiled = this.isFrontendCompiled();

    if (isCompiled && !force) {
      return {
        success: true,
        skipped: true,
        message: 'Frontend already compiled (frontend/.next ready). Skipping compilation.',
      };
    }

    const startTime = Date.now();
    try {
      execSync('npm run build --workspace=frontend', {
        cwd: this.rootDir,
        stdio: 'pipe',
        encoding: 'utf8',
        maxBuffer: 20 * 1024 * 1024,
      });

      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
      return {
        success: true,
        skipped: false,
        durationSec,
        message: `Next.js frontend successfully compiled in ${durationSec}s.`,
      };
    } catch (err) {
      // Fallback inside frontend directory
      try {
        execSync('npx next build', {
          cwd: this.frontendDir,
          stdio: 'pipe',
          encoding: 'utf8',
          maxBuffer: 20 * 1024 * 1024,
        });
        const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
        return {
          success: true,
          skipped: false,
          durationSec,
          message: `Next.js frontend compiled via next CLI in ${durationSec}s.`,
        };
      } catch (fallbackErr) {
        throw new Error(`Failed to compile Next.js Frontend: ${fallbackErr.stderr || fallbackErr.message || err.message}`);
      }
    }
  }

  /**
   * Execute conditional compilation pipeline
   */
  compileIfNeeded(options = {}) {
    const force = options.force || false;
    const skip = options.skip || false;

    if (skip) {
      return {
        backend: { skipped: true, message: 'Compilation explicitly skipped.' },
        frontend: { skipped: true, message: 'Compilation explicitly skipped.' },
      };
    }

    const backendResult = this.compileBackend(force);
    const frontendResult = this.compileFrontend(force);

    return {
      backend: backendResult,
      frontend: frontendResult,
    };
  }
}

module.exports = { ProjectCompiler };

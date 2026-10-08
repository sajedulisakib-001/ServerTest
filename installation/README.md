# 🛠️ Wooden Mir E-Commerce — Automated First-Run Installer & Hosting Auditor

The `installation/` directory contains an automated first-run setup wizard and server compatibility auditor designed to verify hosting environments and configure the full site in seconds.

---

## 🚀 Quick Usage

### 1. Interactive CLI Setup (Recommended)
Run the interactive terminal wizard:
```bash
npm run install:wizard
# OR directly
node installation/index.js
```

### 2. Standalone Web Installer Wizard
Launch the browser-based visual setup wizard on `http://localhost:4000`:
```bash
node installation/index.js --web
```

### 3. Automated Pre-flight Compatibility Audit Only
Test your hosting environment without modifying any files:
```bash
npm run install:check
# OR directly
node installation/index.js --check-only
```

### 4. Non-Interactive Quick Setup (CI / Production Deployments)
Quickly apply standard production defaults:
```bash
node installation/index.js --quick
```

---

## 🔍 Pre-flight Compatibility Checks

The pre-flight audit inspects the hosting environment for:
1. **Node.js Runtime Version**: Requires Node.js `>= 18.0.0` (Recommended: v20 LTS or v22 LTS).
2. **Package Manager**: Verifies availability of `npm` and `npx` in the system path.
3. **Hardware Resources**: Checks Total & Free RAM (requires minimum 1024MB RAM for Next.js builds) and CPU core count.
4. **File System Permissions**: Tests write access across `./`, `backend/`, `frontend/`, and `backend/uploads/`.
5. **Port Availability**: Probes target ports (e.g. `8585` for NestJS backend, `3000` for Next.js frontend).
6. **PostgreSQL Connectivity**: Verifies TCP socket reachability to the target PostgreSQL server.
7. **Security Lockfile**: Detects `installation/installed.lock` to prevent unauthorized re-installation.

---

## 🔐 Security & Lockfile Protection

- **Re-installation Defense**: Once installation completes, an `installed.lock` file is created. Any subsequent execution of the installer will automatically abort to protect active production databases from being overwritten.
- **Force Override**: To intentionally re-install or reconfigure an existing deployment, provide the explicit `--force` flag:
  ```bash
  node installation/index.js --force
  ```
- **Cryptographic Key Synthesis**: High-entropy 64-character hexadecimal JWT secrets are generated using Node's `crypto.randomBytes(32)`.
- **Password Hashing**: Master administrator passwords are hashed with `bcrypt` (10 rounds).

---

## 📁 Architecture

```
installation/
├── index.js          # Master CLI entrypoint & interactive terminal wizard
├── checker.js        # Hosting environment & server compatibility auditor
├── configurator.js   # Environment files generator & lockfile manager
├── migrator.js       # Prisma ORM generation, schema sync & data seeder
├── web-wizard.js     # Zero-dependency browser-based setup wizard
├── installed.lock    # Auto-generated lockfile upon setup completion
└── README.md         # Installer documentation & usage guide
```

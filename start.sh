#!/bin/bash
# Navigate to project root directory
cd "$(dirname "$0")"

export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.docker/bin:$PATH"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       StoreForge Platform — Production Release       ║"
echo "║       NestJS API  ·  Next.js Store  ·  Admin Portal  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

if ! command -v node &> /dev/null; then
    echo "  [ERROR] Node.js not found in PATH. Please install Node.js first."
    exit 1
fi

echo "  [OK] Node  $(node -v)   NPM $(npm -v)"
echo ""

# Optional Docker check (if using containerized PostgreSQL)
if command -v docker &> /dev/null && docker info > /dev/null 2>&1; then
    if [ "$(docker inspect --format='{{.State.Running}}' postgres-test 2>/dev/null)" = "true" ]; then
        echo "  [DB] PostgreSQL container (postgres-test) is already active..."
    elif [ -f "docker-compose.yml" ]; then
        echo "  [DB] Starting PostgreSQL container (postgres-test)..."
        docker compose up -d postgres > /dev/null 2>&1 || true
        sleep 1
    fi
else
    echo "  [DB] Using host/managed PostgreSQL (DATABASE_URL in .env)..."
fi
echo ""

if [ ! -d "node_modules" ] || [ ! -d "node_modules/@prisma" ]; then
    echo "  [INSTALL] Installing production dependencies..."
    if [ "$(uname -s)" = "Linux" ] && [ -f /proc/meminfo ]; then
        SWAP_KB=$(grep SwapTotal /proc/meminfo | awk '{print $2}')
        if [ "$SWAP_KB" -lt 524288 ] && [ "$(id -u)" -eq 0 ]; then
            echo "  [WARN] Low memory VPS detected (<512MB swap). Automatically creating 2GB swapfile..."
            fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
            chmod 600 /swapfile
            mkswap /swapfile >/dev/null 2>&1 || true
            swapon /swapfile 2>/dev/null || true
            grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
            echo "  [OK] Swapfile created."
        fi
    fi
    npm install --omit=dev --no-audit --no-fund --maxsockets=2 || npm install --omit=dev --prefer-offline --no-audit --no-fund --maxsockets=1
    echo ""
fi

# Verify database configuration and schema safely without removing existing data
if [ -f "scripts/db-sync.js" ]; then
    node scripts/db-sync.js || exit 1
fi
echo ""

echo "  [INFO] Launching StoreForge Production Server..."
node scripts/start-server.js

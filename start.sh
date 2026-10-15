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
echo "║   🪵  StoreForge Platform — Production Release        ║"
echo "║       NestJS API  ·  Next.js Store  ·  Admin Portal  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

if ! command -v node &> /dev/null; then
    echo "  ❌  Node.js not found in PATH. Please install Node.js first."
    exit 1
fi

echo "  ✅  Node  $(node -v)   NPM $(npm -v)"
echo ""

# Optional Docker check (if using containerized PostgreSQL)
if command -v docker &> /dev/null && docker info > /dev/null 2>&1; then
    if [ "$(docker inspect --format='{{.State.Running}}' postgres-test 2>/dev/null)" = "true" ]; then
        echo "  🐘  PostgreSQL container (postgres-test) is already active..."
    elif [ -f "docker-compose.yml" ]; then
        echo "  🐘  Starting PostgreSQL container (postgres-test)..."
        docker compose up -d postgres > /dev/null 2>&1 || true
        sleep 1
    fi
else
    echo "  🐘  Using host/managed PostgreSQL (DATABASE_URL in .env)..."
fi
echo ""

if [ ! -d "node_modules" ] || [ ! -d "node_modules/@prisma" ]; then
    echo "  📦  Installing production dependencies..."
    npm install --omit=dev
    echo ""
fi

# If the database was not configured properly on first run, re-run database setup
echo "  ⚙️   Verifying database configuration and schema..."
if [ -f "backend/prisma/schema.prisma" ]; then
    npx prisma db push --schema=backend/prisma/schema.prisma --skip-generate 2>/dev/null || true
fi
echo ""

echo "  🚀  Launching StoreForge Production Server..."
node scripts/start-server.js

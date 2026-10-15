FROM node:20-alpine

WORKDIR /app

# Install dependencies required for native node build tools & Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy workspace configuration and packages
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY admin/package*.json ./admin/

# Install root & workspace dependencies
RUN npm install

# Copy backend source files and Prisma schema
COPY backend ./backend

WORKDIR /app/backend

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 8585

# Start backend dev server with hot reload
CMD ["npm", "run", "dev"]

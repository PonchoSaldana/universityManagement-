# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:20-alpine as build
WORKDIR /app

# Copy root package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files (respecting .dockerignore)
COPY . .

# Build the frontend (Vite)
RUN npm run build

# ==========================================
# Stage 2: Production Backend
# ==========================================
FROM node:20-alpine
WORKDIR /app

# Copy the built frontend assets from the build stage
COPY --from=build /app/dist ./dist

# Set working directory for backend
WORKDIR /app/backend

# Copy backend package files and install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ .

# Configurar variables de entorno predeterminadas (Render sobreescribirá PORT)
ENV PORT=3000
ENV NODE_ENV=production

# Expose the port (informative)
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]

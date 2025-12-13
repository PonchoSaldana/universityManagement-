# Etapa de construcción (Frontend)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción (Backend)
FROM node:20-alpine
WORKDIR /app

# Copiar el build del frontend desde la etapa anterior
COPY --from=build /app/dist ./dist

# Configurar el backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["node", "index.js"]

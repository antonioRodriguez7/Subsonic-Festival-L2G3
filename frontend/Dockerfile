# Etapa 1: Build de la aplicación (Node.js)
FROM node:18-alpine AS build
WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y generamos el build de producción
COPY . .
RUN npm run build

# Etapa 2: Servidor de producción (Nginx)
FROM nginx:stable-alpine

# Copiamos los archivos estáticos generados por Vite (carpeta dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

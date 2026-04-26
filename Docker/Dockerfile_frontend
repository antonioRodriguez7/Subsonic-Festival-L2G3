# ETAPA 1: Construcción con Node 24
FROM node:24-slim AS build

# Creamos la carpeta de trabajo
WORKDIR /app

# Copiamos dependencias (aprovecha la caché)
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de tu código fuente
COPY . .

# Compilamos el proyecto de Vite (genera la carpeta /app/dist)
RUN npm run build


# ETAPA 2: Servidor web con Nginx
FROM nginx:alpine

# Copiamos el resultado de Vite (dist) a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos tu configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 (el estándar de internet)
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]
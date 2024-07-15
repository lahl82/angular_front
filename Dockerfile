## Etapa de construcción

# Usa una imagen base oficial de Node.js
FROM node:20.11.1 AS build

# Configura el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de npm
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Construye la aplicación Angular
RUN npm run build -- --configuration production

## Etapa de ejecución
# Usa una imagen base para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos de build a Nginx
COPY --from=build /app/dist/angular_front/browser /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expone el puerto
EXPOSE 80

# Ejecuta Nginx
CMD ["nginx", "-g", "daemon off;"]

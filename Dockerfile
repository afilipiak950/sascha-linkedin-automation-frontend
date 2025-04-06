# Build-Stage
FROM node:18-alpine as build

WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes
COPY . .

# Erstelle die Produktions-Build
RUN npm run build

# Produktions-Stage
FROM nginx:alpine

# Kopiere die Build-Dateien in das Nginx-Verzeichnis
COPY --from=build /app/build /usr/share/nginx/html

# Kopiere die Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponiere Port 80
EXPOSE 80

# Starte Nginx
CMD ["nginx", "-g", "daemon off;"] 
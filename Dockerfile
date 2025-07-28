# Utiliser Node.js 18
FROM node:18-alpine

# Installer les dépendances système nécessaires pour pg
RUN apk add --no-cache python3 make g++

# Créer le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec force pour pg
RUN npm ci --only=production --unsafe-perm=true

# Forcer la reconstruction de pg
RUN npm rebuild pg

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"] 
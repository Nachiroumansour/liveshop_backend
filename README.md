# LiveShop Backend

API backend pour l'application LiveShop Link.

## 🚀 Déploiement sur Vercel

### Prérequis
- Compte Vercel
- Base de données PostgreSQL (Railway, Supabase, Neon, etc.)

### Variables d'environnement requises

Dans le dashboard Vercel, ajoutez ces variables d'environnement :

```bash
# Configuration PostgreSQL
DB_HOST=votre_host_postgres
DB_PORT=5432
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=votre_nom_de_base

# Configuration JWT
JWT_SECRET=votre_secret_jwt

# Configuration Frontend
FRONTEND_URL=https://votre-frontend.vercel.app

# Environnement
NODE_ENV=production
```

### Déploiement automatique

1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement la configuration
3. Le déploiement se fera automatiquement à chaque push

### Déploiement manuel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

## 📁 Structure du projet

```
src/
├── app.js              # Point d'entrée
├── config/
│   └── database.js     # Configuration base de données
├── middleware/
│   └── auth.js         # Middleware d'authentification
├── models/             # Modèles Sequelize
├── routes/             # Routes API
├── services/           # Services métier
└── scripts/            # Scripts utilitaires
```

## 🔧 Développement local

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Démarrer en production
npm start
```

## 📊 Base de données

Le projet supporte SQLite (développement) et PostgreSQL (production).

- **Développement** : SQLite automatique si pas de variables PostgreSQL
- **Production** : PostgreSQL requis via variables d'environnement # redeploy trigger

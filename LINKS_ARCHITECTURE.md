# 🔗 Architecture des Liens - LiveShop Link

## 📋 Vue d'ensemble

Ce document décrit l'architecture des liens publics et des lives pour supporter des milliers de vendeurs.

## 🏪 Liens Publics des Vendeurs

### Format
- **Longueur** : 8-12 caractères
- **Caractères autorisés** : `a-z`, `0-9`
- **Exemple** : `qbos55dx`, `nwzqqz2w`

### Génération
```javascript
// Algorithme amélioré pour éviter les collisions
const generateUniquePublicLinkId = async () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    // Générer un ID de 10 caractères
    const linkId = generateRandomString(10, characters);
    
    // Vérifier l'unicité
    const existing = await Seller.findOne({ where: { public_link_id: linkId } });
    if (!existing) return linkId;
    
    attempts++;
  }
  
  // Fallback avec timestamp
  return `v${Date.now().toString(36)}${randomSuffix}`;
};
```

### Routes Publiques
```
GET  /:linkId/products           # Liste des produits
GET  /:linkId/products/:id       # Détail d'un produit
POST /:linkId/orders             # Créer une commande
POST /:linkId/comments           # Ajouter un commentaire
```

### Validation
```javascript
const linkIdRegex = /^[a-z0-9]{8,12}$/;
```

## 📺 Liens des Lives

### Format
- **Base** : Titre normalisé (max 50 caractères)
- **Suffixe** : 4 caractères alphanumériques
- **Exemple** : `vente-bijoux-abc1`, `mode-ete-def2`

### Génération
```javascript
const generateUniqueSlug = async (title) => {
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Caractères spéciaux
    .replace(/\s+/g, '-')          // Espaces → tirets
    .replace(/-+/g, '-')           // Tirets multiples
    .substring(0, 50);             // Limite longueur
  
  let attempts = 0;
  while (attempts < 10) {
    const slug = attempts === 0 ? baseSlug : `${baseSlug}-${randomSuffix}`;
    
    const existing = await Live.findOne({ where: { slug } });
    if (!existing) return slug;
    
    attempts++;
  }
  
  // Fallback avec timestamp
  return `${baseSlug}-${Date.now().toString(36)}`;
};
```

### Routes des Lives
```
GET  /lives/:slug/products        # Produits du live
GET  /lives/:slug/orders          # Commandes du live
POST /lives/:slug/orders          # Commander pendant le live
```

## 🔒 Sécurité et Performance

### Rate Limiting
```javascript
// À implémenter pour les routes publiques
const rateLimit = require('express-rate-limit');

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: 'Trop de requêtes, réessayez plus tard'
});
```

### Cache
```javascript
// Cache Redis pour les produits publics
const cacheProducts = async (linkId, products) => {
  await redis.setex(`products:${linkId}`, 300, JSON.stringify(products));
};
```

### Validation
- ✅ Format des liens publics
- ✅ Unicité des slugs
- ✅ Limite de tentatives
- ✅ Fallback avec timestamp

## 📊 Capacité et Évolutivité

### Calculs de Capacité
- **Liens publics** : 36^10 = 3.6 × 10^15 combinaisons possibles
- **Slugs de lives** : Illimité avec suffixe
- **Performance** : O(log n) avec index sur `public_link_id`

### Monitoring
```javascript
// Métriques à surveiller
- Nombre de liens générés par jour
- Taux de collisions
- Temps de génération moyen
- Erreurs de validation
```

## 🚀 Déploiement

### Migration
```bash
# Migrer les liens existants
node migrate-links.js

# Vérifier l'intégrité
node verify-links.js
```

### Configuration Production
```javascript
// Variables d'environnement
LINK_GENERATION_MAX_ATTEMPTS=10
LINK_PUBLIC_LENGTH=10
LINK_CACHE_TTL=300
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🔧 Maintenance

### Nettoyage
- Supprimer les liens orphelins
- Archiver les lives anciens
- Optimiser les index de base de données

### Monitoring
- Alertes sur les collisions
- Surveillance des performances
- Logs des erreurs de génération

## 📈 Évolution Future

### Améliorations Possibles
- [ ] Préfixes par région/pays
- [ ] Liens personnalisables
- [ ] QR codes automatiques
- [ ] Analytics des liens
- [ ] A/B testing des formats

### Scalabilité
- [ ] Sharding par région
- [ ] Cache distribué
- [ ] CDN pour les liens publics
- [ ] Base de données dédiée aux liens 
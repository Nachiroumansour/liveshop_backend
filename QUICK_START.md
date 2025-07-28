# 🚀 Guide de Démarrage Rapide - Notifications Temps Réel

## ⚡ Test en 5 minutes

### 1. Préparer l'environnement
```bash
# Terminal 1 - Backend
cd liveshop-backend
npm install
npm run seed
npm run dev
```

```bash
# Terminal 2 - App vendeur
cd mobile-app/liveshop-vendor
npm install
npm run dev
```

```bash
# Terminal 3 - Web client
cd web-client/liveshop-client
npm install
npm run dev
```

### 2. Vérifier que tout fonctionne
```bash
# Terminal 4 - Test rapide
cd liveshop-backend
npm run test:quick
```

### 3. Se connecter à l'app vendeur
- **URL** : http://localhost:5174
- **Numéro** : +221771234567 (Fatou)
- **PIN** : 1234
- **Vérifier** : Icône WiFi vert dans la sidebar

### 4. Tester les notifications
```bash
# Terminal 5 - Simulation
cd liveshop-backend
npm run simulate multiple 5 3000
```

## 🎯 Résultat attendu

✅ **5 notifications** apparaissent dans l'app vendeur
✅ **Toast animés** avec détails des commandes
✅ **Navigation directe** vers les commandes
✅ **Aucun rafraîchissement** nécessaire

## 📱 Vendeurs de test disponibles

| Nom | Téléphone | PIN | Spécialité |
|-----|-----------|-----|------------|
| Fatou Diallo | +221771234567 | 1234 | Bijoux |
| Mamadou Ba | +221772345678 | 1234 | Vêtements |
| Aissatou Diop | +221773456789 | 1234 | Cosmétiques |
| Ousmane Sall | +221774567890 | 1234 | Électronique |
| Mariama Fall | +221775678901 | 1234 | Alimentation |

## 🌐 Liens de test

### Boutiques publiques
- **Fatou** : http://localhost:3000/fatou123
- **Mamadou** : http://localhost:3000/mamadou456
- **Aissatou** : http://localhost:3000/aissatou789
- **Ousmane** : http://localhost:3000/ousmane012
- **Mariama** : http://localhost:3000/mariama345

### Lives
- **Live Fatou** : http://localhost:3000/fatou123/live/1
- **Live Mamadou** : http://localhost:3000/mamadou456/live/2
- **Live Aissatou** : http://localhost:3000/aissatou789/live/3

## 🧪 Commandes de simulation

```bash
# Une seule commande
npm run simulate single

# 10 commandes avec 2 secondes d'intervalle
npm run simulate multiple 10 2000

# Simulation continue (nouvelle commande toutes les 3 secondes)
npm run simulate continuous 3000
```

## 🔧 Dépannage rapide

### Problème : Pas de notifications
1. **Vérifier la connexion WebSocket** : Icône WiFi vert
2. **Redémarrer le backend** : `npm run dev`
3. **Vérifier les ports** : 3001, 5174, 3000

### Problème : Erreur de base de données
1. **Réexécuter le seed** : `npm run seed`
2. **Vérifier le fichier** : `database.sqlite` présent

### Problème : App vendeur ne se charge pas
1. **Vérifier les dépendances** : `npm install`
2. **Vérifier le port** : 5174 disponible
3. **Vérifier la console** : Erreurs JavaScript

## ✅ Checklist de validation

- [ ] Backend démarré (port 3001)
- [ ] App vendeur démarrée (port 5174)
- [ ] Web client démarré (port 3000)
- [ ] Données de test créées (`npm run seed`)
- [ ] Vendeur connecté (WiFi vert)
- [ ] Simulation fonctionne (`npm run simulate single`)
- [ ] Notifications apparaissent
- [ ] Liens publics accessibles

## 🎉 Félicitations !

Si tout fonctionne, vous avez un système de live commerce complet avec :
- ✅ **Notifications en temps réel** via WebSocket
- ✅ **Interface moderne** et responsive
- ✅ **Système multivendeur** isolé
- ✅ **Liens publics uniques** par vendeur
- ✅ **Gestion des commandes** en temps réel
- ✅ **Simulation réaliste** pour les tests

## 🚀 Prochaines étapes

1. **Tester avec de vrais utilisateurs**
2. **Ajouter des sons de notification**
3. **Implémenter les notifications push**
4. **Optimiser les performances**
5. **Déployer en production** 
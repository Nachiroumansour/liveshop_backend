const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'liveshop_secret_key';

// Générer un token pour Mamadou Ba (ID: 2)
const sellerId = 2;
const token = jwt.sign(
  { sellerId }, 
  JWT_SECRET, 
  { expiresIn: '30d' }
);

console.log('🔑 Token généré pour Mamadou Ba (ID: 2):');
console.log(token);
console.log('\n📋 Instructions pour l\'app mobile:');
console.log('1. Ouvrez les DevTools de l\'app mobile (F12)');
console.log('2. Allez dans l\'onglet "Console"');
console.log('3. Exécutez cette commande:');
console.log(`localStorage.setItem('liveshop_token', '${token}')`);
console.log('4. Rechargez la page (F5)');
console.log('\n✅ Le token sera maintenant valide pour les requêtes API'); 
const jwt = require('jsonwebtoken');

// Test avec différents JWT_SECRET possibles
const secrets = [
  'liveshop_secret_key_2025',
  'liveshop_secret_key',
  'your-secret-key',
  process.env.JWT_SECRET
].filter(Boolean);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJZCI6MiwiaWF0IjoxNzUyODAwMzMxLCJleHAiOjE3NTUzOTIzMzF9.lhFjgzW0FUgRrs51yyG8fFKqaQ85oTSY_52TR8SgLpY';

console.log('🔍 Test de validation JWT...');
console.log('Token:', token);
console.log('JWT_SECRET env:', process.env.JWT_SECRET);

secrets.forEach((secret, index) => {
  try {
    const decoded = jwt.verify(token, secret);
    console.log(`✅ Secret ${index + 1} (${secret}) - VALIDE`);
    console.log('   Decoded:', decoded);
  } catch (error) {
    console.log(`❌ Secret ${index + 1} (${secret}) - INVALIDE:`, error.message);
  }
}); 
const jwt = require('jsonwebtoken');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'liveshop_secret_key';
const SELLER_ID = 2; // ID du vendeur Mamadou Ba

// Générer un token de test
const generateTestToken = () => {
  const token = jwt.sign(
    { sellerId: SELLER_ID },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  console.log('🔑 Token de test généré:');
  console.log('=====================================');
  console.log(token);
  console.log('=====================================');
  console.log('');
  console.log('📋 Pour utiliser ce token:');
  console.log('1. Copiez le token ci-dessus');
  console.log('2. Remplacez la valeur de SELLER_TOKEN dans test-notifications-simple.js');
  console.log('3. Relancez le test');
  
  return token;
};

// Vérifier le token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token valide:');
    console.log('   Seller ID:', decoded.sellerId);
    console.log('   Expiration:', new Date(decoded.exp * 1000).toLocaleString());
    return decoded;
  } catch (error) {
    console.error('❌ Token invalide:', error.message);
    return null;
  }
};

// Générer et vérifier le token
const token = generateTestToken();
verifyToken(token); 
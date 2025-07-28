const jwt = require('jsonwebtoken');
const { Seller } = require('./src/models');

const JWT_SECRET = 'liveshop_secret_key_2025_dev';

async function generateAndTestToken() {
  try {
    console.log('🔍 Vérification du vendeur...');
    
    // Vérifier que le vendeur existe
    const seller = await Seller.findByPk(1);
    if (!seller) {
      console.log('❌ Vendeur avec ID 1 non trouvé');
      return;
    }
    
    console.log('✅ Vendeur trouvé:', seller.name);
    
    // Générer un token
    const token = jwt.sign(
      { sellerId: seller.id }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );
    
    console.log('🔑 Token généré:', token);
    
    // Tester le token
    console.log('\n🧪 Test du token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token décodé:', decoded);
    
    // Vérifier que le vendeur peut être trouvé avec ce token
    const testSeller = await Seller.findByPk(decoded.sellerId);
    if (testSeller) {
      console.log('✅ Vendeur trouvé avec le token:', testSeller.name);
    } else {
      console.log('❌ Vendeur non trouvé avec le token');
    }
    
    console.log('\n📋 Instructions:');
    console.log('1. Copiez ce token dans l\'app mobile localStorage');
    console.log('2. Utilisez ce token pour les tests API');
    console.log('3. Token:', token);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

generateAndTestToken(); 
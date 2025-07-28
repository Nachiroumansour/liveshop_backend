const jwt = require('jsonwebtoken');
const { Seller } = require('./src/models');

const JWT_SECRET = 'liveshop_secret_key_2025_dev';

async function generateTokenForMamadou() {
  try {
    console.log('🔍 Génération du token pour Mamadou Ba...');
    
    // Vérifier que Mamadou Ba existe
    const seller = await Seller.findByPk(2);
    if (!seller) {
      console.log('❌ Mamadou Ba (ID: 2) non trouvé');
      return;
    }
    
    console.log('✅ Vendeur trouvé:', seller.name);
    console.log('📱 Téléphone:', seller.phone_number);
    console.log('🔗 Link ID:', seller.public_link_id);
    
    // Générer un token
    const token = jwt.sign(
      { sellerId: seller.id }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );
    
    console.log('\n🔑 Token généré pour Mamadou Ba:');
    console.log(token);
    
    // Tester le token
    console.log('\n🧪 Test du token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token décodé:', decoded);
    
    console.log('\n📋 Instructions pour l\'app mobile:');
    console.log('1. Ouvrez la console du navigateur (F12)');
    console.log('2. Exécutez cette commande:');
    console.log(`localStorage.setItem("token", "${token}")`);
    console.log('3. Rechargez la page');
    console.log('4. Vous devriez maintenant voir les notifications de Mamadou Ba');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

generateTokenForMamadou(); 
const { Seller } = require('./src/models');

async function checkSeller() {
  try {
    console.log('🔍 Vérification du vendeur...');
    
    const seller = await Seller.findByPk(1);
    
    if (seller) {
      console.log('✅ Vendeur trouvé:');
      console.log('   - ID:', seller.id);
      console.log('   - Nom:', seller.name);
      console.log('   - Email:', seller.email);
      console.log('   - Public Link ID:', seller.public_link_id);
    } else {
      console.log('❌ Aucun vendeur avec ID 1 trouvé');
      
      // Lister tous les vendeurs
      const allSellers = await Seller.findAll();
      console.log('\n📋 Tous les vendeurs:');
      allSellers.forEach(s => {
        console.log(`   - ID: ${s.id}, Nom: ${s.name}, Email: ${s.email}`);
      });
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkSeller(); 
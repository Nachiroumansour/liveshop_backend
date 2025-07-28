const { Seller } = require('./src/models');

async function checkAllSellers() {
  try {
    console.log('🔍 Vérification de tous les vendeurs...');
    
    const sellers = await Seller.findAll();
    
    if (sellers.length === 0) {
      console.log('❌ Aucun vendeur trouvé');
      return;
    }
    
    console.log(`✅ ${sellers.length} vendeur(s) trouvé(s):`);
    sellers.forEach((seller, index) => {
      console.log(`\n${index + 1}. Vendeur:`);
      console.log(`   - ID: ${seller.id}`);
      console.log(`   - Nom: ${seller.name}`);
      console.log(`   - Téléphone: ${seller.phone_number}`);
      console.log(`   - Public Link ID: ${seller.public_link_id}`);
      console.log(`   - Créé le: ${seller.created_at}`);
    });
    
    // Chercher le vendeur avec le linkId qbos55dx (de l'interface)
    console.log('\n🔍 Recherche du vendeur avec linkId "qbos55dx"...');
    const targetSeller = await Seller.findOne({
      where: { public_link_id: 'qbos55dx' }
    });
    
    if (targetSeller) {
      console.log('✅ Vendeur trouvé avec linkId qbos55dx:');
      console.log(`   - ID: ${targetSeller.id}`);
      console.log(`   - Nom: ${targetSeller.name}`);
      console.log(`   - Téléphone: ${targetSeller.phone_number}`);
    } else {
      console.log('❌ Aucun vendeur avec linkId "qbos55dx" trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkAllSellers(); 
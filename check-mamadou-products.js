const { Seller, Product } = require('./src/models');

async function checkMamadouProducts() {
  try {
    console.log('🔍 Vérification des produits de Mamadou Ba...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    console.log('✅ Mamadou Ba:', mamadou.name);
    console.log('🔗 Link ID:', mamadou.public_link_id);
    
    // 2. Vérifier ses produits
    const products = await Product.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']]
    });
    
    console.log(`\n📦 ${products.length} produit(s) trouvé(s) pour Mamadou Ba:`);
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. Produit:`);
      console.log(`   - ID: ${product.id}`);
      console.log(`   - Nom: ${product.name}`);
      console.log(`   - Prix: ${product.price} FCFA`);
      console.log(`   - Stock: ${product.stock_quantity}`);
      console.log(`   - Image: ${product.image_url || 'Aucune'}`);
      console.log(`   - Créé le: ${product.created_at}`);
    });
    
    if (products.length === 0) {
      console.log('\n❌ Aucun produit trouvé pour Mamadou Ba');
      console.log('🔧 Il faut créer au moins un produit pour tester les notifications');
    } else {
      console.log('\n✅ Produits disponibles pour les tests');
      console.log('📋 Utilisez l\'ID du premier produit pour les tests');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkMamadouProducts(); 
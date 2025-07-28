const { Product, Seller } = require('./src/models');

async function checkProducts() {
  try {
    // Trouver Mamadou Ba
    const seller = await Seller.findOne({ where: { name: 'Mamadou Ba' } });
    
    if (!seller) {
      console.log('❌ Mamadou Ba non trouvé');
      return;
    }
    
    console.log('👤 Vendeur:', seller.name);
    console.log('📱 Téléphone:', seller.phone_number);
    console.log('🔗 Link ID:', seller.public_link_id);
    console.log('');
    
    // Trouver ses produits
    const products = await Product.findAll({ 
      where: { seller_id: seller.id },
      order: [['created_at', 'DESC']]
    });
    
    console.log('📦 Produits de Mamadou Ba:');
    console.log('==========================');
    
    if (products.length === 0) {
      console.log('❌ Aucun produit trouvé');
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Prix: ${product.price} FCFA`);
        console.log(`   Stock: ${product.stock_quantity}`);
        console.log(`   Vendeur ID: ${product.seller_id}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    process.exit();
  }
}

checkProducts(); 
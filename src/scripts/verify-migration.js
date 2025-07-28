const { sequelize } = require('../config/database');
const { Seller, Product, Order, Live, LiveProduct, Notification, OTP } = require('../models');

async function verifyMigration() {
  try {
    console.log('🔍 Vérification de la migration...');
    
    const stats = {
      sellers: await Seller.count(),
      products: await Product.count(),
      orders: await Order.count(),
      lives: await Live.count(),
      liveProducts: await LiveProduct.count(),
      notifications: await Notification.count(),
      otps: await OTP.count()
    };
    
    console.log('📊 Statistiques PostgreSQL:');
    console.log(`   Vendeurs: ${stats.sellers}`);
    console.log(`   Produits: ${stats.products}`);
    console.log(`   Commandes: ${stats.orders}`);
    console.log(`   Lives: ${stats.lives}`);
    console.log(`   Associations live_products: ${stats.liveProducts}`);
    console.log(`   Notifications: ${stats.notifications}`);
    console.log(`   OTPs: ${stats.otps}`);
    
    // Vérifier quelques exemples de données
    console.log('\n🔍 Vérification des données...');
    
    const sampleSeller = await Seller.findOne();
    if (sampleSeller) {
      console.log(`   ✅ Vendeur exemple: ${sampleSeller.name} (${sampleSeller.public_link_id})`);
    }
    
    const sampleProduct = await Product.findOne();
    if (sampleProduct) {
      console.log(`   ✅ Produit exemple: ${sampleProduct.name} (${sampleProduct.price} FCFA)`);
    }
    
    const sampleLive = await Live.findOne();
    if (sampleLive) {
      console.log(`   ✅ Live exemple: ${sampleLive.title}`);
    }
    
    console.log('\n✅ Migration vérifiée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await sequelize.close();
  }
}

verifyMigration(); 
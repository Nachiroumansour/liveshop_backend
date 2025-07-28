const bcrypt = require('bcryptjs');
const { Seller } = require('./src/models');

async function setupMamadouAuth() {
  try {
    console.log('🔧 Configuration de l\'authentification pour Mamadou Ba...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    if (!mamadou) {
      console.log('❌ Mamadou Ba non trouvé');
      return;
    }
    
    console.log('✅ Mamadou Ba trouvé:', mamadou.name);
    console.log('📱 Téléphone:', mamadou.phone_number);
    
    // 2. Configurer un PIN par défaut
    const defaultPin = '1234';
    const pinHash = await bcrypt.hash(defaultPin, 10);
    
    // 3. Mettre à jour le PIN
    await mamadou.update({ pin_hash: pinHash });
    
    console.log('✅ PIN configuré pour Mamadou Ba');
    console.log('🔐 PIN par défaut:', defaultPin);
    
    // 4. Instructions pour l'authentification
    console.log('\n🚀 INSTRUCTIONS POUR L\'AUTHENTIFICATION:');
    console.log('=' .repeat(60));
    console.log('1. Ouvrez l\'app mobile dans le navigateur');
    console.log('2. Cliquez sur "Se connecter"');
    console.log('3. Entrez les informations suivantes:');
    console.log(`   - Numéro de téléphone: ${mamadou.phone_number}`);
    console.log(`   - Code PIN: ${defaultPin}`);
    console.log('4. Cliquez sur "Se connecter"');
    console.log('5. Vous devriez être connecté et voir les notifications!');
    console.log('=' .repeat(60));
    
    // 5. Test de connexion
    console.log('\n🧪 Test de connexion...');
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = 'liveshop_secret_key_2025_dev';
    
    const token = jwt.sign(
      { sellerId: mamadou.id }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );
    
    console.log('✅ Token de test généré');
    console.log('🔑 Token:', token);
    
    // 6. Vérifier les commandes et notifications
    const { Order, Notification } = require('./src/models');
    
    const orders = await Order.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 3
    });
    
    const notifications = await Notification.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 3
    });
    
    console.log(`\n📊 Statistiques pour Mamadou Ba:`);
    console.log(`   - Commandes: ${orders.length}`);
    console.log(`   - Notifications: ${notifications.length}`);
    
    if (orders.length > 0) {
      console.log('\n📋 Commandes récentes:');
      orders.forEach(order => {
        console.log(`   - Commande #${order.id}: ${order.customer_name} - ${order.total_price} FCFA`);
      });
    }
    
    if (notifications.length > 0) {
      console.log('\n🔔 Notifications récentes:');
      notifications.forEach(notif => {
        console.log(`   - ${notif.type}: ${notif.title}`);
      });
    }
    
    console.log('\n🎉 CONFIGURATION TERMINÉE!');
    console.log('📱 Mamadou Ba peut maintenant se connecter et recevoir des notifications');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

setupMamadouAuth(); 
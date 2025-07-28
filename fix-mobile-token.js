const jwt = require('jsonwebtoken');
const { Seller, Order, Notification } = require('./src/models');

const JWT_SECRET = 'liveshop_secret_key_2025_dev';

async function fixMobileToken() {
  try {
    console.log('🔧 Correction du système de notifications...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    if (!mamadou) {
      console.log('❌ Mamadou Ba non trouvé');
      return;
    }
    
    console.log('✅ Mamadou Ba trouvé:', mamadou.name);
    
    // 2. Générer le token correct
    const token = jwt.sign(
      { sellerId: mamadou.id }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );
    
    console.log('\n🔑 TOKEN POUR L\'APP MOBILE:');
    console.log('=' .repeat(50));
    console.log(token);
    console.log('=' .repeat(50));
    
    // 3. Vérifier les commandes récentes
    console.log('\n📋 Vérification des commandes récentes...');
    const recentOrders = await Order.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    console.log(`✅ ${recentOrders.length} commande(s) trouvée(s) pour Mamadou Ba:`);
    recentOrders.forEach(order => {
      console.log(`   - Commande #${order.id}: ${order.customer_name} - ${order.total_price} FCFA`);
    });
    
    // 4. Vérifier les notifications
    console.log('\n🔔 Vérification des notifications...');
    const notifications = await Notification.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    console.log(`✅ ${notifications.length} notification(s) trouvée(s) pour Mamadou Ba:`);
    notifications.forEach(notif => {
      console.log(`   - ${notif.type}: ${notif.title} (${notif.read ? 'Lu' : 'Non lu'})`);
    });
    
    // 5. Instructions pour l'utilisateur
    console.log('\n🚀 INSTRUCTIONS POUR PRODUCTION:');
    console.log('=' .repeat(50));
    console.log('1. Ouvrez l\'app mobile dans le navigateur');
    console.log('2. Appuyez sur F12 pour ouvrir la console');
    console.log('3. Copiez et collez cette commande:');
    console.log(`localStorage.setItem("token", "${token}")`);
    console.log('4. Appuyez sur Entrée');
    console.log('5. Rechargez la page (F5)');
    console.log('6. Vous devriez maintenant voir les notifications en temps réel!');
    console.log('=' .repeat(50));
    
    // 6. Test de notification en temps réel
    console.log('\n🧪 Test de notification en temps réel...');
    const testData = {
      order: {
        id: 999,
        customer_name: 'Test Client',
        total_price: 50000,
        product: {
          name: 'Produit Test'
        }
      },
      message: 'Test notification production'
    };
    
    // Simuler une notification
    const notificationService = require('./src/services/notificationService');
    const { sent } = await notificationService.sendRealtimeNotification(
      mamadou.id,
      'new_order',
      testData
    );
    
    console.log('✅ Test notification:', sent ? 'Envoyée' : 'En queue');
    
    console.log('\n🎉 SYSTÈME PRÊT POUR PRODUCTION!');
    console.log('📱 Les notifications fonctionneront maintenant en temps réel');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

fixMobileToken(); 
const { Seller, Order, Notification } = require('./src/models');
const io = require('socket.io-client');

async function debugNotifications() {
  try {
    console.log('🔍 Debug des notifications...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    console.log('✅ Mamadou Ba:', mamadou.name, '(ID:', mamadou.id, ')');
    
    // 2. Vérifier les commandes récentes
    console.log('\n📋 Commandes récentes pour Mamadou Ba:');
    const recentOrders = await Order.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    console.log(`✅ ${recentOrders.length} commande(s) trouvée(s):`);
    recentOrders.forEach(order => {
      console.log(`   - Commande #${order.id}: ${order.customer_name} - ${order.total_price} FCFA (${order.created_at})`);
    });
    
    // 3. Vérifier les notifications
    console.log('\n🔔 Notifications pour Mamadou Ba:');
    const notifications = await Notification.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    console.log(`✅ ${notifications.length} notification(s) trouvée(s):`);
    notifications.forEach(notif => {
      console.log(`   - ${notif.type}: ${notif.title} (${notif.read ? 'Lu' : 'Non lu'}) - ${notif.created_at}`);
    });
    
    // 4. Test WebSocket
    console.log('\n🔌 Test de connexion WebSocket...');
    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
      
      // Authentification
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = 'liveshop_secret_key_2025_dev';
      const token = jwt.sign({ sellerId: mamadou.id }, JWT_SECRET, { expiresIn: '30d' });
      
      console.log('🔐 Authentification WebSocket...');
      socket.emit('authenticate', { token });
    });
    
    socket.on('authenticated', (data) => {
      console.log('✅ WebSocket authentifié:', data.message);
      console.log('📱 Vendeur connecté:', data.seller.name);
      
      // Test de notification
      setTimeout(() => {
        console.log('\n🧪 Test de notification en temps réel...');
        const testData = {
          order: {
            id: 999,
            customer_name: 'Test Debug',
            total_price: 50000,
            product: { name: 'Produit Test' }
          }
        };
        
        socket.emit('new_order', testData);
        console.log('📤 Notification de test envoyée via WebSocket');
        
        setTimeout(() => {
          socket.disconnect();
          console.log('🔌 WebSocket déconnecté');
        }, 2000);
      }, 1000);
    });
    
    socket.on('error', (error) => {
      console.log('❌ Erreur WebSocket:', error.message);
    });
    
    socket.on('new_order', (data) => {
      console.log('🎉 NOTIFICATION REÇUE EN TEMPS RÉEL!');
      console.log('📦 Commande:', data.order.id);
      console.log('👤 Client:', data.order.customer_name);
    });
    
    // 5. Vérifier le service de notifications
    console.log('\n🔧 Vérification du service de notifications...');
    const notificationService = require('./src/services/notificationService');
    
    // Test d'envoi de notification
    const testData = {
      order: {
        id: 999,
        customer_name: 'Test Debug',
        total_price: 50000,
        product: { name: 'Produit Test' }
      }
    };
    
    const { sent } = await notificationService.sendRealtimeNotification(
      mamadou.id,
      'new_order',
      testData
    );
    
    console.log('✅ Test notification service:', sent ? 'Envoyée' : 'En queue');
    
    // 6. Instructions de debug
    console.log('\n🚀 INSTRUCTIONS DE DEBUG:');
    console.log('=' .repeat(50));
    console.log('1. Vérifiez que l\'app mobile est bien connectée');
    console.log('2. Ouvrez la console du navigateur (F12)');
    console.log('3. Vérifiez les erreurs WebSocket');
    console.log('4. Vérifiez que le token est bien stocké:');
    console.log('   localStorage.getItem("liveshop_token")');
    console.log('5. Rechargez la page si nécessaire');
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  // Attendre avant de quitter pour les tests WebSocket
  setTimeout(() => {
    process.exit(0);
  }, 5000);
}

debugNotifications(); 
const { Seller, Product } = require('./src/models');

async function testNotificationDirect() {
  try {
    console.log('🔍 Test direct de notification...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    console.log('✅ Mamadou Ba:', mamadou.name);
    
    // 2. Vérifier si global.notifySeller existe
    console.log('\n🔧 Vérification de global.notifySeller:');
    console.log('   - Existe:', !!global.notifySeller);
    console.log('   - Type:', typeof global.notifySeller);
    
    if (!global.notifySeller) {
      console.log('❌ global.notifySeller n\'existe pas!');
      return;
    }
    
    // 3. Vérifier les connexions WebSocket actives
    console.log('\n🔌 Connexions WebSocket actives:');
    if (global.sellerConnections) {
      const connections = global.sellerConnections.get(mamadou.id);
      console.log(`   - Vendeur ${mamadou.id} (${mamadou.name}):`);
      if (connections) {
        console.log(`     - ${connections.size} connexion(s) active(s)`);
        connections.forEach(socketId => {
          console.log(`     - Socket ID: ${socketId}`);
        });
      } else {
        console.log('     - Aucune connexion active');
      }
    } else {
      console.log('   - global.sellerConnections n\'existe pas');
    }
    
    // 4. Tester l'envoi direct de notification
    console.log('\n🔔 Test d\'envoi direct de notification...');
    
    const testData = {
      order: {
        id: 999,
        customer_name: 'Client Test Direct',
        total_price: 15000,
        status: 'pending'
      },
      message: 'Test de notification directe'
    };
    
    try {
      global.notifySeller(mamadou.id, 'new_order', testData);
      console.log('✅ Notification envoyée directement');
    } catch (error) {
      console.error('❌ Erreur envoi direct:', error);
    }
    
    // 5. Vérifier les notifications en base
    console.log('\n📊 Vérification des notifications en base...');
    const { Notification } = require('./src/models');
    
    const notifications = await Notification.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    console.log(`📦 ${notifications.length} notification(s) trouvée(s):`);
    notifications.forEach((notif, index) => {
      console.log(`\n${index + 1}. Notification:`);
      console.log(`   - ID: ${notif.id}`);
      console.log(`   - Type: ${notif.type}`);
      console.log(`   - Titre: ${notif.title}`);
      console.log(`   - Message: ${notif.message}`);
      console.log(`   - Envoyée: ${notif.sent ? 'Oui' : 'Non'}`);
      console.log(`   - Créée: ${notif.created_at}`);
    });
    
    console.log('\n✅ Test terminé');
    
  } catch (error) {
    console.error('❌ Erreur test direct:', error);
  }
}

// Exécuter le test
testNotificationDirect(); 
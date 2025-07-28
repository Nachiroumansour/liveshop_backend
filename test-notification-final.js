const io = require('socket.io-client');
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const WS_URL = 'http://localhost:3001';

// Configuration
const testConfig = {
  sellerId: 1,
  sellerName: 'Test Seller',
  customerName: 'Test Client',
  productName: 'Produit Test',
  totalPrice: 25000
};

// Fonction pour générer un token JWT
function generateTestToken(sellerId) {
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'liveshop_secret_key';
  
  return jwt.sign(
    { sellerId }, 
    JWT_SECRET, 
    { expiresIn: '30d' }
  );
}

// Test 1: Connexion WebSocket et authentification
async function testWebSocketConnection() {
  console.log('\n🔌 Test 1: Connexion WebSocket...');
  
  return new Promise((resolve, reject) => {
    const socket = io(WS_URL);
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
      
      // Authentification
      const token = generateTestToken(testConfig.sellerId);
      socket.emit('authenticate', { token });
    });
    
    socket.on('authenticated', (data) => {
      console.log('✅ Authentification réussie:', data.message);
      console.log('📱 Vendeur connecté:', data.seller.name);
      socket.disconnect();
      resolve(true);
    });
    
    socket.on('error', (error) => {
      console.log('❌ Erreur WebSocket:', error.message);
      socket.disconnect();
      reject(error);
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 WebSocket déconnecté');
    });
    
    // Timeout
    setTimeout(() => {
      socket.disconnect();
      reject(new Error('Timeout WebSocket'));
    }, 5000);
  });
}

// Test 2: Création d'une commande avec notification
async function testOrderCreation() {
  console.log('\n🛒 Test 2: Création de commande...');
  
  try {
    const orderData = {
      customer_name: testConfig.customerName,
      customer_phone: '+2250701234567',
      customer_address: '123 Rue Test, Abidjan',
      total_price: testConfig.totalPrice,
      payment_method: 'cash',
      product_id: 1,
      quantity: 1,
      attributes: JSON.stringify({
        size: 'M',
        color: 'Rouge'
      })
    };
    
    const response = await axios.post(`${BASE_URL}/api/public/orders`, orderData);
    
    if (response.data.success) {
      console.log('✅ Commande créée avec succès');
      console.log('📋 ID Commande:', response.data.order.id);
      console.log('💰 Montant:', response.data.order.total_price.toLocaleString(), 'FCFA');
      return response.data.order;
    } else {
      throw new Error('Échec création commande');
    }
  } catch (error) {
    console.log('❌ Erreur création commande:', error.response?.data?.error || error.message);
    throw error;
  }
}

// Test 3: Test de notification via API
async function testNotificationAPI() {
  console.log('\n🔔 Test 3: Test notification via API...');
  
  try {
    const token = generateTestToken(testConfig.sellerId);
    const response = await axios.post(
      `${BASE_URL}/api/notifications/test`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Test notification API réussi');
      console.log('📤 Envoyé:', response.data.sent);
      console.log('💬 Message:', response.data.message);
      return response.data;
    } else {
      throw new Error('Échec test notification API');
    }
  } catch (error) {
    console.log('❌ Erreur test notification API:', error.response?.data?.error || error.message);
    throw error;
  }
}

// Test 4: Vérification des notifications en base
async function testNotificationDatabase() {
  console.log('\n💾 Test 4: Vérification notifications en base...');
  
  try {
    const token = generateTestToken(testConfig.sellerId);
    const response = await axios.get(
      `${BASE_URL}/api/notifications`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Notifications récupérées');
      console.log('📊 Nombre de notifications:', response.data.count);
      
      if (response.data.notifications.length > 0) {
        const latest = response.data.notifications[0];
        console.log('📝 Dernière notification:');
        console.log('   - Type:', latest.type);
        console.log('   - Titre:', latest.title);
        console.log('   - Message:', latest.message);
        console.log('   - Lu:', latest.read ? 'Oui' : 'Non');
        console.log('   - Envoyé:', latest.sent ? 'Oui' : 'Non');
      }
      
      return response.data;
    } else {
      throw new Error('Échec récupération notifications');
    }
  } catch (error) {
    console.log('❌ Erreur récupération notifications:', error.response?.data?.error || error.message);
    throw error;
  }
}

// Test 5: Test complet avec WebSocket en temps réel
async function testRealTimeNotification() {
  console.log('\n⚡ Test 5: Test notification temps réel...');
  
  return new Promise((resolve, reject) => {
    const socket = io(WS_URL);
    let notificationReceived = false;
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connecté pour test temps réel');
      
      const token = generateTestToken(testConfig.sellerId);
      socket.emit('authenticate', { token });
    });
    
    socket.on('authenticated', async (data) => {
      console.log('✅ Authentifié, création commande...');
      
      try {
        // Créer une commande qui devrait déclencher une notification
        await testOrderCreation();
        
        // Attendre la notification
        setTimeout(() => {
          if (!notificationReceived) {
            console.log('⏰ Timeout - Aucune notification reçue');
            socket.disconnect();
            resolve(false);
          }
        }, 3000);
        
      } catch (error) {
        console.log('❌ Erreur création commande:', error.message);
        socket.disconnect();
        reject(error);
      }
    });
    
    socket.on('new_order', (data) => {
      console.log('🎉 NOTIFICATION REÇUE EN TEMPS RÉEL!');
      console.log('📦 Commande:', data.order.id);
      console.log('👤 Client:', data.order.customer_name);
      console.log('💰 Montant:', data.order.total_price.toLocaleString(), 'FCFA');
      notificationReceived = true;
      socket.disconnect();
      resolve(true);
    });
    
    socket.on('error', (error) => {
      console.log('❌ Erreur WebSocket:', error.message);
      socket.disconnect();
      reject(error);
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 WebSocket déconnecté');
    });
    
    // Timeout global
    setTimeout(() => {
      if (!notificationReceived) {
        socket.disconnect();
        resolve(false);
      }
    }, 10000);
  });
}

// Test principal
async function runAllTests() {
  console.log('🚀 Démarrage des tests de notification...');
  console.log('=' .repeat(50));
  
  const results = {
    websocket: false,
    orderCreation: false,
    notificationAPI: false,
    database: false,
    realtime: false
  };
  
  try {
    // Test 1: WebSocket
    results.websocket = await testWebSocketConnection();
    
    // Test 2: Création commande
    results.orderCreation = await testOrderCreation();
    
    // Test 3: API notification
    results.notificationAPI = await testNotificationAPI();
    
    // Test 4: Base de données
    results.database = await testNotificationDatabase();
    
    // Test 5: Temps réel
    results.realtime = await testRealTimeNotification();
    
  } catch (error) {
    console.log('❌ Erreur lors des tests:', error.message);
  }
  
  // Résumé
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('=' .repeat(50));
  console.log('🔌 WebSocket:', results.websocket ? '✅ OK' : '❌ ÉCHEC');
  console.log('🛒 Création commande:', results.orderCreation ? '✅ OK' : '❌ ÉCHEC');
  console.log('🔔 API notification:', results.notificationAPI ? '✅ OK' : '❌ ÉCHEC');
  console.log('💾 Base de données:', results.database ? '✅ OK' : '❌ ÉCHEC');
  console.log('⚡ Temps réel:', results.realtime ? '✅ OK' : '❌ ÉCHEC');
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log('\n🎯 Score:', `${successCount}/${totalTests} tests réussis`);
  
  if (successCount === totalTests) {
    console.log('🎉 TOUS LES TESTS SONT RÉUSSIS! Le système de notification fonctionne parfaitement.');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }
  
  process.exit(0);
}

// Exécution
runAllTests().catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
}); 
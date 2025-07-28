const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testSimpleNotification() {
  console.log('🧪 Test simple de notification\n');

  try {
    // Créer une commande de test
    console.log('📦 Création d\'une commande de test...');
    const orderResponse = await axios.post(`${BASE_URL}/api/public/qbos55dx/orders`, {
      product_id: 35,
      customer_name: 'Test Simple',
      customer_phone: '771234567',
      customer_address: 'Test Address',
      quantity: 1,
      payment_method: 'cash'
    });
    
    console.log('✅ Commande créée avec succès');
    console.log('📊 ID de la commande:', orderResponse.data.order.id);
    console.log('📊 Notification envoyée:', orderResponse.data.notification_sent);
    console.log('📊 Client:', orderResponse.data.order.customer_name);
    console.log('📊 Montant:', orderResponse.data.order.total_price, 'FCFA');
    
    console.log('\n🎯 Si vous ne recevez pas de notification dans l\'espace vendeur:');
    console.log('1. Vérifiez que l\'app mobile est ouverte');
    console.log('2. Vérifiez que le token JWT est correct (voir fix-mobile-token.js)');
    console.log('3. Vérifiez la console du navigateur pour les erreurs WebSocket');
    console.log('4. Vérifiez que les permissions de notification sont accordées');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

// Lancer le test
testSimpleNotification(); 
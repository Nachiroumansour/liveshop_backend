const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3001/api';
const PUBLIC_LINK_ID = 'qbos55dx';

async function testNotificationSimple() {
  try {
    console.log('🧪 Test simple des notifications...\n');

    // Créer une commande de test
    const orderData = {
      product_id: 23, // Boubou homme traditionnel
      customer_name: 'Test Notification',
      customer_phone: '777777777',
      customer_address: 'Adresse de test',
      quantity: 1,
      payment_method: 'cash',
      comment: 'Test notification simple'
    };

    console.log('📦 Création de commande...');
    const response = await axios.post(`${API_BASE}/public/${PUBLIC_LINK_ID}/orders`, orderData);
    
    console.log('✅ Commande créée:', response.data.order.id);
    console.log('📡 Notification envoyée:', response.data.notification_sent ? 'OUI' : 'NON');
    
    if (response.data.notification_sent) {
      console.log('\n🎉 Notification envoyée avec succès !');
      console.log('📱 Vérifiez dans votre app mobile que vous recevez :');
      console.log('   - Toast notification (popup)');
      console.log('   - Son de notification');
      console.log('   - Notification vocale');
    } else {
      console.log('\n❌ Notification non envoyée');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.error || error.message);
  }
}

testNotificationSimple(); 
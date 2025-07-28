const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3001/api';
const SELLER_ID = 2; // Mamadou Ba
const PUBLIC_LINK_ID = 'qbos55dx'; // public_link_id du vendeur

// Fonction pour tester les notifications
async function testNotifications() {
  try {
    console.log('🧪 Test des notifications...\n');

    // 1. Test de création d'une commande (déclenche notification new_order)
    console.log('1️⃣ Test création de commande...');
    const orderData = {
      product_id: 23, // Boubou homme traditionnel
      customer_name: 'Test Client',
      customer_phone: '777777777',
      customer_address: 'Adresse de test',
      quantity: 1,
      payment_method: 'cash',
      comment: 'Test de notification'
    };

    const orderResponse = await axios.post(`${API_BASE}/public/${PUBLIC_LINK_ID}/orders`, orderData);
    console.log('✅ Commande créée:', orderResponse.data.order.id);
    console.log('📡 Notification "new_order" envoyée au vendeur\n');

    // Attendre 2 secondes
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Test de mise à jour de statut (déclenche notification order_status_update)
    console.log('2️⃣ Test mise à jour de statut...');
    const orderId = orderResponse.data.order.id;
    
    const statusResponse = await axios.put(`${API_BASE}/orders/${orderId}/status`, {
      status: 'paid'
    }, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJZCI6MiwiaWF0IjoxNzMxODQ4MDAwLCJleHAiOjE3MzE5MzQ0MDB9.test'
      }
    });
    console.log('✅ Statut mis à jour:', statusResponse.data.message);
    console.log('📡 Notification "order_status_update" envoyée au vendeur\n');

    console.log('🎉 Tests terminés !');
    console.log('\n📱 Vérifiez dans l\'app mobile :');
    console.log('   - Notification toast en haut à droite');
    console.log('   - Son de notification (double bip pour nouvelle commande)');
    console.log('   - Annonce vocale (si activée)');
    console.log('   - Mise à jour automatique de la liste des commandes');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Lancer le test
testNotifications(); 
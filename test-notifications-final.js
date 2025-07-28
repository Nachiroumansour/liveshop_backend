const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3001/api';
const PUBLIC_LINK_ID = 'qbos55dx'; // public_link_id du vendeur Mamadou Ba

// Fonction pour tester les notifications de manière simple
async function testNotificationsFinal() {
  try {
    console.log('🧪 Test final des notifications...\n');

    // 1. Vérifier que le serveur répond
    console.log('1️⃣ Vérification du serveur...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      console.log('✅ Serveur en ligne:', healthResponse.data.message);
    } catch (error) {
      console.error('❌ Serveur inaccessible:', error.message);
      return;
    }

    // 2. Test de création de commande (déclenche notification new_order)
    console.log('\n2️⃣ Test création de commande...');
    const orderData = {
      product_id: 23, // Boubou homme traditionnel
      customer_name: 'Client Test Final',
      customer_phone: '777777777',
      customer_address: 'Adresse de test final',
      quantity: 1,
      payment_method: 'cash',
      comment: 'Test de notification final'
    };

    try {
      const orderResponse = await axios.post(`${API_BASE}/public/${PUBLIC_LINK_ID}/orders`, orderData);
      console.log('✅ Commande créée avec succès');
      console.log('   - ID:', orderResponse.data.order.id);
      console.log('   - Client:', orderResponse.data.order.customer_name);
      console.log('   - Montant:', orderResponse.data.order.total_price.toLocaleString(), 'FCFA');
      console.log('   - Statut:', orderResponse.data.order.status);
      
      if (orderResponse.data.notification_sent) {
        console.log('   - 📡 Notification envoyée au vendeur');
      } else {
        console.log('   - ⚠️ Notification non envoyée');
      }
    } catch (error) {
      console.error('❌ Erreur création commande:', error.response?.data?.error || error.message);
      return;
    }

    console.log('\n🎉 Test des notifications terminé avec succès !');
    console.log('\n📱 Instructions pour tester dans l\'app mobile:');
    console.log('1. Ouvrez l\'app mobile dans votre navigateur');
    console.log('2. Connectez-vous avec le vendeur Mamadou Ba');
    console.log('3. Allez sur la page des commandes');
    console.log('4. Vous devriez voir la nouvelle commande et recevoir les notifications');
    console.log('\n🔔 Types de notifications que vous devriez recevoir:');
    console.log('- Toast notification (popup)');
    console.log('- Son de notification');
    console.log('- Notification vocale');
    console.log('- Notification push du navigateur (si autorisée)');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécuter le test
testNotificationsFinal(); 
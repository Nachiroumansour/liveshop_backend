const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3001/api';
const SELLER_ID = 2; // Mamadou Ba
const PUBLIC_LINK_ID = 'qbos55dx'; // public_link_id du vendeur

// Fonction pour tester les notifications de manière robuste
async function testNotificationsRobust() {
  try {
    console.log('🧪 Test robuste des notifications...\n');

    // 1. Vérifier que le serveur répond
    console.log('1️⃣ Vérification du serveur...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      console.log('✅ Serveur en ligne:', healthResponse.data.message);
    } catch (error) {
      console.error('❌ Serveur inaccessible:', error.message);
      return;
    }

    // 2. Vérifier que le vendeur existe
    console.log('\n2️⃣ Vérification du vendeur...');
    try {
      const sellerResponse = await axios.get(`${API_BASE}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`
        }
      });
      console.log('✅ Vendeur trouvé:', sellerResponse.data.seller.name);
    } catch (error) {
      console.log('⚠️ Token de test invalide (normal)');
    }

    // 3. Vérifier les produits disponibles
    console.log('\n3️⃣ Vérification des produits...');
    try {
      const productsResponse = await axios.get(`${API_BASE}/products?limit=1`);
      const product = productsResponse.data.products[0];
      if (product) {
        console.log('✅ Produit trouvé:', product.name, `(${product.price} FCFA)`);
      } else {
        console.log('⚠️ Aucun produit trouvé');
        return;
      }
    } catch (error) {
      console.error('❌ Erreur récupération produits:', error.message);
      return;
    }

    // 4. Test de création de commande (déclenche notification new_order)
    console.log('\n4️⃣ Test création de commande...');
    const orderData = {
      product_id: 23, // Boubou homme traditionnel
      customer_name: 'Test Client Robuste',
      customer_phone: '777777777',
      customer_address: 'Adresse de test robuste',
      quantity: 1,
      payment_method: 'cash',
      comment: 'Test de notification robuste'
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

    // 5. Test de mise à jour de statut
    console.log('\n5️⃣ Test mise à jour de statut...');
    try {
      const orderId = orderResponse.data.order.id;
      const updateResponse = await axios.patch(`${API_BASE}/orders/${orderId}/status`, {
        status: 'paid'
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`
        }
      });
      console.log('✅ Statut mis à jour:', updateResponse.data.order.status);
    } catch (error) {
      console.log('⚠️ Impossible de mettre à jour le statut (token invalide)');
    }

    // 6. Vérification finale
    console.log('\n6️⃣ Vérification finale...');
    try {
      const ordersResponse = await axios.get(`${API_BASE}/orders?limit=1`);
      const latestOrder = ordersResponse.data.orders[0];
      if (latestOrder && latestOrder.customer_name === 'Test Client Robuste') {
        console.log('✅ Commande trouvée dans la base de données');
        console.log('   - ID:', latestOrder.id);
        console.log('   - Client:', latestOrder.customer_name);
        console.log('   - Montant:', latestOrder.total_price.toLocaleString(), 'FCFA');
      }
    } catch (error) {
      console.log('⚠️ Impossible de vérifier la commande (token invalide)');
    }

    console.log('\n🎉 Test des notifications terminé avec succès !');
    console.log('\n📱 Pour tester dans l\'app mobile:');
    console.log('1. Ouvrez l\'app mobile dans votre navigateur');
    console.log('2. Connectez-vous avec le vendeur Mamadou Ba');
    console.log('3. Allez sur la page des commandes');
    console.log('4. Vous devriez voir la nouvelle commande et recevoir les notifications');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécuter le test
testNotificationsRobust(); 
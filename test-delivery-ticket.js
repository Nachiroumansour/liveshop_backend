const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const SELLER_LINK_ID = 'qbos55dx';

// Test de création de commande puis génération de ticket
const testOrder = {
  product_id: 37, // Sac à dos urbain (appartient à Mamadou Ba)
  customer_name: 'Test Livraison',
  customer_phone: '+221771234567',
  customer_address: '123 Rue Test, Dakar',
  quantity: 1,
  payment_method: 'wave'
};

console.log('🧪 Test de génération de ticket de livraison');
console.log('============================================');

async function testDeliveryTicket() {
  try {
    // 1. Créer une commande
    console.log('📦 1. Création d\'une commande de test...');
    const orderResponse = await axios.post(
      `${BACKEND_URL}/api/public/${SELLER_LINK_ID}/orders`,
      testOrder,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const orderId = orderResponse.data.order.id;
    console.log(`✅ Commande créée: #${orderId}`);

    // 2. Générer un token pour le vendeur
    console.log('🔑 2. Génération du token vendeur...');
    const tokenResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      phone_number: '+221772345678',
      pin: '1234'
    });

    const token = tokenResponse.data.token;
    console.log('✅ Token généré');

    // 3. Tester la génération du ticket PDF
    console.log('🖨️ 3. Test de génération du ticket PDF...');
    const pdfResponse = await axios.get(
      `${BACKEND_URL}/api/orders/${orderId}/delivery-ticket`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('✅ PDF généré avec succès');
    console.log(`📄 Taille du PDF: ${pdfResponse.data.length} bytes`);

    // 4. Tester l'API des informations de livraison
    console.log('📱 4. Test de l\'API des informations de livraison...');
    const infoResponse = await axios.get(
      `${BACKEND_URL}/api/orders/${orderId}/delivery-info`
    );

    console.log('✅ Informations de livraison récupérées');
    console.log('📋 Détails de la commande:');
    console.log(`   - Client: ${infoResponse.data.order.customer_name}`);
    console.log(`   - Produit: ${infoResponse.data.order.product?.name}`);
    console.log(`   - Prix: ${infoResponse.data.order.total_price} FCFA`);

    // 5. Afficher l'URL du QR code
    const deliveryUrl = `http://localhost:5173/delivery/${orderId}`;
    console.log('\n🎯 5. URL du QR code:');
    console.log(`   ${deliveryUrl}`);
    console.log('   📱 Le livreur peut scanner le QR code pour voir les détails complets');

    console.log('\n✅ Test terminé avec succès !');
    console.log('\n💡 Pour tester complètement:');
    console.log('   1. Connectez-vous dans l\'app mobile vendeur');
    console.log('   2. Cliquez sur "Ticket" pour une commande');
    console.log('   3. Le PDF sera téléchargé avec le QR code');
    console.log('   4. Scannez le QR code pour voir la page web');

  } catch (error) {
    console.error('❌ Erreur:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    
    if (error.response?.data?.error) {
      console.error('Erreur détaillée:', error.response.data.error);
    }
  }
}

testDeliveryTicket(); 
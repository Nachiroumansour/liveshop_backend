const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';

console.log('🧪 Test simple de génération de ticket');
console.log('=====================================');

async function testSimpleTicket() {
  try {
    // 1. Générer un token pour le vendeur
    console.log('🔑 1. Génération du token vendeur...');
    const tokenResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      phone_number: '+221772345678',
      pin: '1234'
    });

    const token = tokenResponse.data.token;
    console.log('✅ Token généré');

    // 2. Tester l'API des informations de livraison (sans authentification)
    console.log('📱 2. Test de l\'API des informations de livraison...');
    const infoResponse = await axios.get(
      `${BACKEND_URL}/api/orders/29/delivery-info`
    );

    console.log('✅ Informations de livraison récupérées');
    console.log('📋 Détails de la commande:');
    console.log(`   - Client: ${infoResponse.data.order.customer_name}`);
    console.log(`   - Produit: ${infoResponse.data.order.product?.name}`);
    console.log(`   - Prix: ${infoResponse.data.order.total_price} FCFA`);

    // 3. Tester la génération du ticket PDF
    console.log('🖨️ 3. Test de génération du ticket PDF...');
    const pdfResponse = await axios.get(
      `${BACKEND_URL}/api/orders/29/delivery-ticket`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('✅ PDF généré avec succès');
    console.log(`📄 Taille du PDF: ${pdfResponse.data.length} bytes`);

    // 4. Afficher l'URL du QR code
    const deliveryUrl = `http://localhost:5173/delivery/29`;
    console.log('\n🎯 4. URL du QR code:');
    console.log(`   ${deliveryUrl}`);

    console.log('\n✅ Test terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur:');
    console.error('Status:', error.response?.status);
    
    if (error.response?.data) {
      try {
        const errorText = Buffer.from(error.response.data).toString('utf8');
        console.error('Message:', errorText);
      } catch (e) {
        console.error('Message (raw):', error.response.data);
      }
    }
  }
}

testSimpleTicket(); 
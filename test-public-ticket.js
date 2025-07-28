const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';

console.log('🧪 Test des routes publiques de tickets');
console.log('=====================================');

async function testPublicTicket() {
  try {
    // 1. Test de la route des informations de livraison
    console.log('📱 1. Test de l\'API des informations de livraison...');
    const infoResponse = await axios.get(`${BACKEND_URL}/api/public/orders/29/delivery-info`);
    
    console.log('✅ Informations de livraison récupérées');
    console.log('📋 Détails de la commande:');
    console.log(`   - Client: ${infoResponse.data.order.customer_name}`);
    console.log(`   - Produit: ${infoResponse.data.order.product?.name}`);
    console.log(`   - Prix: ${infoResponse.data.order.total_price} FCFA`);

    // 2. Test de la génération du ticket PDF
    console.log('🖨️ 2. Test de génération du ticket PDF...');
    const pdfResponse = await axios.get(
      `${BACKEND_URL}/api/public/orders/29/delivery-ticket`,
      {
        responseType: 'arraybuffer'
      }
    );

    console.log('✅ PDF généré avec succès');
    console.log(`📄 Taille du PDF: ${pdfResponse.data.length} bytes`);

    // 3. Afficher l'URL du QR code
    const deliveryUrl = `http://localhost:5173/delivery/29`;
    console.log('\n🎯 3. URL du QR code:');
    console.log(`   ${deliveryUrl}`);
    console.log('   📱 Le livreur peut scanner le QR code pour voir les détails complets');

    console.log('\n✅ Test terminé avec succès !');
    console.log('\n💡 Pour tester complètement:');
    console.log('   1. Ouvrez l\'URL du QR code dans un navigateur');
    console.log('   2. Vérifiez que la page de livraison s\'affiche correctement');
    console.log('   3. Testez le bouton "Imprimer" dans l\'app mobile vendeur');

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

testPublicTicket(); 
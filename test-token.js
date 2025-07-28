const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';

console.log('🔑 Test de validation du token');
console.log('=============================');

async function testToken() {
  try {
    // 1. Générer un token pour le vendeur
    console.log('🔑 1. Génération du token vendeur...');
    const tokenResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      phone_number: '+221772345678',
      pin: '1234'
    });

    const token = tokenResponse.data.token;
    console.log('✅ Token généré:', token.substring(0, 20) + '...');

    // 2. Tester la route des commandes
    console.log('📦 2. Test de la route des commandes...');
    const ordersResponse = await axios.get(`${BACKEND_URL}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Route des commandes accessible');
    console.log(`📊 Nombre de commandes: ${ordersResponse.data.orders.length}`);

    // 3. Tester la route de génération de ticket
    console.log('🖨️ 3. Test de la route de génération de ticket...');
    const ticketResponse = await axios.get(`${BACKEND_URL}/api/orders/29/delivery-ticket`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'arraybuffer'
    });

    console.log('✅ Route de génération de ticket accessible');
    console.log(`📄 Taille du PDF: ${ticketResponse.data.length} bytes`);

    console.log('\n✅ Token valide et authentification fonctionnelle !');

  } catch (error) {
    console.error('❌ Erreur:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
  }
}

testToken(); 
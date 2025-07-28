const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';

console.log('🧪 Test de la route');
console.log('==================');

async function testRoute() {
  try {
    // Test de la route simple
    console.log('🔗 Test de la route /test...');
    const testResponse = await axios.get(`${BACKEND_URL}/api/orders/test`);
    console.log('✅ Route /test accessible:', testResponse.data);

    // Test de la route avec authentification
    console.log('🔑 Génération du token...');
    const tokenResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      phone_number: '+221772345678',
      pin: '1234'
    });

    const token = tokenResponse.data.token;
    console.log('✅ Token généré');

    // Test de la route de ticket
    console.log('🖨️ Test de la route de ticket...');
    const ticketResponse = await axios.get(`${BACKEND_URL}/api/orders/29/delivery-ticket`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'arraybuffer'
    });

    console.log('✅ Route de ticket accessible');
    console.log(`📄 Taille: ${ticketResponse.data.length} bytes`);

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

testRoute(); 
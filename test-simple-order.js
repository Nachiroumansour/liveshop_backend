const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const SELLER_LINK_ID = 'qbos55dx';

// Test simple avec un produit existant
const testOrder = {
  product_id: 37, // Sac à dos urbain (appartient à Mamadou Ba)
  customer_name: 'Test Client',
  customer_phone: '+221771234567',
  customer_address: 'Test Address',
  quantity: 1,
  payment_method: 'wave'
};

console.log('🧪 Test simple de création de commande');
console.log('=====================================');

async function testOrderCreation() {
  try {
    console.log('📡 Envoi de la requête...');
    console.log('URL:', `${BACKEND_URL}/api/public/${SELLER_LINK_ID}/orders`);
    console.log('Données:', JSON.stringify(testOrder, null, 2));
    
    const response = await axios.post(
      `${BACKEND_URL}/api/public/${SELLER_LINK_ID}/orders`,
      testOrder,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Succès!');
    console.log('Réponse:', response.data);

  } catch (error) {
    console.error('❌ Erreur:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    
    if (error.response?.data?.error) {
      console.error('Erreur détaillée:', error.response.data.error);
    }
  }
}

testOrderCreation(); 
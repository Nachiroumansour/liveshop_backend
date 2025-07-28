const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJZCI6MSwiaWF0IjoxNzUyOTU4NzE4LCJleHAiOjE3NTU1NTA3MTh9.gysDTXyrPc_ptbNA-ZQ4EhbJZkoChebM8DDQieP2iKg';

async function testWithValidToken() {
  console.log('🚀 Test avec token valide...');
  
  try {
    // 1. Tester l'API de notification
    console.log('\n🔔 Test API notification...');
    const notificationResponse = await axios.post(
      `${BASE_URL}/api/notifications/test`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${VALID_TOKEN}`
        }
      }
    );
    
    console.log('✅ Test notification réussi:', notificationResponse.data);
    
    // 2. Récupérer les notifications
    console.log('\n📋 Récupération des notifications...');
    const notificationsResponse = await axios.get(
      `${BASE_URL}/api/notifications`,
      {
        headers: {
          'Authorization': `Bearer ${VALID_TOKEN}`
        }
      }
    );
    
    console.log('✅ Notifications récupérées:', notificationsResponse.data);
    
    // 3. Créer une commande (avec le bon linkId)
    console.log('\n🛒 Création d\'une commande...');
    const orderData = {
      customer_name: 'Test Client',
      customer_phone: '+2250701234567',
      customer_address: '123 Rue Test, Abidjan',
      payment_method: 'cash',
      product_id: 1,
      quantity: 1
    };
    
    // Utiliser le linkId du vendeur (nwzqqz2w)
    const orderResponse = await axios.post(`${BASE_URL}/api/public/nwzqqz2w/orders`, orderData);
    console.log('✅ Commande créée:', orderResponse.data);
    
    // 4. Vérifier les nouvelles notifications
    console.log('\n🔍 Vérification des nouvelles notifications...');
    const newNotificationsResponse = await axios.get(
      `${BASE_URL}/api/notifications`,
      {
        headers: {
          'Authorization': `Bearer ${VALID_TOKEN}`
        }
      }
    );
    
    console.log('✅ Nouvelles notifications:', newNotificationsResponse.data);
    
    console.log('\n🎉 TOUS LES TESTS SONT RÉUSSIS!');
    console.log('\n📱 Pour tester dans l\'app mobile:');
    console.log('1. Ouvrez la console du navigateur');
    console.log('2. Exécutez: localStorage.setItem("token", "' + VALID_TOKEN + '")');
    console.log('3. Rechargez la page');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testWithValidToken(); 
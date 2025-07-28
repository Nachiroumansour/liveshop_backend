const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET || 'liveshop_secret_key';

async function testNotifications() {
  console.log('🚀 Test des notifications via HTTP...');
  
  try {
    // 1. Générer un token
    const token = jwt.sign(
      { sellerId: 1 }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );
    
    console.log('✅ Token généré');
    
    // 2. Tester l'API de notification
    console.log('\n🔔 Test API notification...');
    const notificationResponse = await axios.post(
      `${BASE_URL}/api/notifications/test`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ Test notification réussi:', notificationResponse.data);
    
    // 3. Récupérer les notifications
    console.log('\n📋 Récupération des notifications...');
    const notificationsResponse = await axios.get(
      `${BASE_URL}/api/notifications`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ Notifications récupérées:', notificationsResponse.data);
    
    // 4. Créer une commande
    console.log('\n🛒 Création d\'une commande...');
    const orderData = {
      customer_name: 'Test Client',
      customer_phone: '+2250701234567',
      customer_address: '123 Rue Test, Abidjan',
      total_price: 25000,
      payment_method: 'cash',
      product_id: 1,
      quantity: 1,
      attributes: JSON.stringify({
        size: 'M',
        color: 'Rouge'
      })
    };
    
    const orderResponse = await axios.post(`${BASE_URL}/api/public/orders`, orderData);
    console.log('✅ Commande créée:', orderResponse.data);
    
    // 5. Vérifier les nouvelles notifications
    console.log('\n🔍 Vérification des nouvelles notifications...');
    const newNotificationsResponse = await axios.get(
      `${BASE_URL}/api/notifications`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ Nouvelles notifications:', newNotificationsResponse.data);
    
    console.log('\n🎉 TOUS LES TESTS HTTP SONT RÉUSSIS!');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testNotifications(); 
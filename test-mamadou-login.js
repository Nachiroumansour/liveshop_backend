const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testMamadouLogin() {
  try {
    console.log('🧪 Test de connexion pour Mamadou Ba...');
    
    // 1. Test de connexion
    console.log('\n🔐 Test de connexion...');
    const loginData = {
      phone_number: '+221772345678',
      pin: '1234'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    
    if (loginResponse.data.token) {
      console.log('✅ Connexion réussie!');
      console.log('🔑 Token reçu:', loginResponse.data.token.substring(0, 50) + '...');
      console.log('📱 Vendeur:', loginResponse.data.seller.name);
      
      const token = loginResponse.data.token;
      
      // 2. Test de vérification du token
      console.log('\n🔍 Test de vérification du token...');
      const verifyResponse = await axios.get(`${BASE_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Token vérifié avec succès');
      console.log('📱 Vendeur vérifié:', verifyResponse.data.seller.name);
      
      // 3. Test des notifications
      console.log('\n🔔 Test des notifications...');
      const notificationsResponse = await axios.get(`${BASE_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Notifications récupérées');
      console.log('📊 Nombre de notifications:', notificationsResponse.data.count);
      
      if (notificationsResponse.data.notifications.length > 0) {
        console.log('📝 Dernière notification:');
        const latest = notificationsResponse.data.notifications[0];
        console.log(`   - Type: ${latest.type}`);
        console.log(`   - Titre: ${latest.title}`);
        console.log(`   - Message: ${latest.message}`);
        console.log(`   - Lu: ${latest.read ? 'Oui' : 'Non'}`);
      }
      
      // 4. Test de notification en temps réel
      console.log('\n⚡ Test de notification en temps réel...');
      const testNotificationResponse = await axios.post(`${BASE_URL}/api/notifications/test`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Test notification:', testNotificationResponse.data.message);
      
      console.log('\n🎉 TOUS LES TESTS SONT RÉUSSIS!');
      console.log('📱 Mamadou Ba peut maintenant se connecter à l\'app mobile');
      console.log('\n📋 Instructions pour l\'utilisateur:');
      console.log('1. Ouvrez l\'app mobile');
      console.log('2. Connectez-vous avec:');
      console.log('   - Téléphone: +221772345678');
      console.log('   - PIN: 1234');
      console.log('3. Vous devriez voir les notifications en temps réel!');
      
    } else {
      console.log('❌ Échec de la connexion');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testMamadouLogin(); 
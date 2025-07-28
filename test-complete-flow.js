const axios = require('axios');
const io = require('socket.io-client');
const { Seller } = require('./src/models');

const BASE_URL = 'http://localhost:3001';

async function testCompleteFlow() {
  try {
    console.log('🚀 Test complet du flux d\'authentification et notifications...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    console.log('✅ Mamadou Ba:', mamadou.name);
    console.log('🔗 Link ID:', mamadou.public_link_id);
    
    // 2. Test d'authentification normale (comme dans l'app mobile)
    console.log('\n🔐 Test d\'authentification normale...');
    const loginData = {
      phone_number: '+221772345678',
      pin: '1234'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    
    if (!loginResponse.data.token) {
      console.log('❌ Échec de l\'authentification');
      return;
    }
    
    console.log('✅ Authentification réussie');
    const token = loginResponse.data.token;
    console.log('📱 Vendeur connecté:', loginResponse.data.seller.name);
    
    // 3. Test de connexion WebSocket (comme dans l'app mobile)
    console.log('\n🔌 Test de connexion WebSocket...');
    const socket = io(BASE_URL);
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
      socket.emit('authenticate', { token });
    });
    
    socket.on('authenticated', async (data) => {
      console.log('✅ WebSocket authentifié pour Mamadou Ba');
      console.log('📱 Vendeur connecté:', data.seller.name);
      
      // 4. Créer une commande via l'API publique (simulation client)
      console.log('\n🛒 Création d\'une commande via l\'API publique...');
      const orderData = {
        customer_name: 'Client Test',
        customer_phone: '+2250701234567',
        customer_address: 'Adresse Test',
        payment_method: 'cash',
        product_id: 44, // Premier produit de Mamadou Ba
        quantity: 1
      };
      
      try {
        const orderResponse = await axios.post(`${BASE_URL}/api/public/${mamadou.public_link_id}/orders`, orderData);
        console.log('✅ Commande créée via API:', orderResponse.data.order.id);
        console.log('📦 Notification envoyée:', orderResponse.data.notification_sent ? 'Oui' : 'Non');
      } catch (error) {
        console.log('❌ Erreur création commande:', error.response?.data?.error || error.message);
      }
      
      // 5. Attendre et vérifier si la notification arrive
      console.log('\n⏳ Attente de la notification...');
      
      let notificationReceived = false;
      
      // Écouter les notifications
      socket.on('new_order', (data) => {
        console.log('🎉 NOTIFICATION REÇUE EN TEMPS RÉEL!');
        console.log('📦 Commande:', data.order.id);
        console.log('👤 Client:', data.order.customer_name);
        console.log('💰 Montant:', data.order.total_price);
        notificationReceived = true;
      });
      
      // Attendre 5 secondes pour la notification
      setTimeout(() => {
        if (notificationReceived) {
          console.log('\n✅ SUCCÈS! Le système fonctionne parfaitement!');
          console.log('📱 Mamadou Ba reçoit les notifications en temps réel');
        } else {
          console.log('\n❌ ÉCHEC! Aucune notification reçue');
          console.log('🔧 Le problème vient du service de notifications');
        }
        
        socket.disconnect();
        process.exit(0);
      }, 5000);
    });
    
    socket.on('error', (error) => {
      console.log('❌ Erreur WebSocket:', error.message);
    });
    
    // 6. Instructions pour l'utilisateur
    console.log('\n📱 INSTRUCTIONS POUR L\'UTILISATEUR:');
    console.log('=' .repeat(60));
    console.log('1. Connectez-vous normalement à l\'app mobile avec:');
    console.log('   - Téléphone: +221772345678');
    console.log('   - PIN: 1234');
    console.log('2. Une fois connecté, créez un live et copiez le lien');
    console.log('3. Commandez depuis le lien public');
    console.log('4. Vous devriez recevoir la notification en temps réel!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testCompleteFlow(); 
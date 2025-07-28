const WebSocket = require('ws');
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001';

async function testNotifications() {
  console.log('🧪 Test complet du système de notifications\n');

  try {
    // 1. Vérifier que le serveur est en marche
    console.log('1️⃣ Vérification du serveur...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Serveur en marche:', healthResponse.data);

    // 2. Utiliser le token existant du vendeur
    console.log('\n2️⃣ Utilisation du token vendeur...');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJZCI6MiwiaWF0IjoxNzUyODQxNjE3LCJleHAiOjE3NTU0MzM2MTd9.SDEnR2Ls9xDxQHW1iZfd7Flm2FwpRCUDH5nFmjF2Ioo';
    console.log('✅ Token utilisé:', token.substring(0, 20) + '...');

    // 3. Se connecter au WebSocket
    console.log('\n3️⃣ Connexion WebSocket...');
    const ws = new WebSocket(WS_URL);

    ws.on('open', () => {
      console.log('✅ WebSocket connecté');
      
      // Authentification
      ws.send(JSON.stringify({
        type: 'authenticate',
        token: token
      }));
    });

    ws.on('message', (data) => {
      const message = JSON.parse(data);
      console.log('📨 Message WebSocket reçu:', message);
      
      if (message.type === 'authenticated') {
        console.log('✅ WebSocket authentifié');
        
        // 4. Créer une commande de test
        setTimeout(async () => {
          console.log('\n4️⃣ Création d\'une commande de test...');
          try {
            const orderResponse = await axios.post(`${BASE_URL}/api/public/qbos55dx/orders`, {
              product_id: 35,
              customer_name: 'Test Notification',
              customer_phone: '771234567',
              customer_address: 'Test Address',
              quantity: 1,
              payment_method: 'cash_on_delivery'
            });
            
            console.log('✅ Commande créée:', orderResponse.data);
            console.log('📊 notification_sent:', orderResponse.data.notification_sent);
            
            // 5. Attendre les notifications
            console.log('\n5️⃣ Attente des notifications...');
            console.log('⏳ Vérifiez votre application mobile pour voir les notifications');
            
          } catch (error) {
            console.error('❌ Erreur création commande:', error.response?.data || error.message);
          }
        }, 2000);
      }
    });

    ws.on('error', (error) => {
      console.error('❌ Erreur WebSocket:', error);
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket fermé');
    });

    // 6. Attendre un peu puis fermer
    setTimeout(() => {
      console.log('\n6️⃣ Fermeture du test...');
      ws.close();
      process.exit(0);
    }, 10000);

  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Lancer le test
testNotifications(); 
const { io } = require('socket.io-client');
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testNotifications() {
  console.log('🧪 Test complet du système de notifications avec Socket.IO\n');

  try {
    // 1. Vérifier que le serveur est en marche
    console.log('1️⃣ Vérification du serveur...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Serveur en marche:', healthResponse.data);

    // 2. Utiliser le token existant du vendeur
    console.log('\n2️⃣ Utilisation du token vendeur...');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJZCI6MiwiaWF0IjoxNzUyODQxNjE3LCJleHAiOjE3NTU0MzM2MTd9.SDEnR2Ls9xDxQHW1iZfd7Flm2FwpRCUDH5nFmjF2Ioo';
    console.log('✅ Token utilisé:', token.substring(0, 20) + '...');

    // 3. Se connecter au WebSocket avec Socket.IO
    console.log('\n3️⃣ Connexion WebSocket avec Socket.IO...');
    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      timeout: 15000
    });

    socket.on('connect', () => {
      console.log('✅ Socket.IO connecté avec succès');
      console.log('🆔 Socket ID:', socket.id);
      
      // Authentification
      socket.emit('authenticate', { token: token });
    });

    socket.on('authenticated', (data) => {
      console.log('✅ Socket.IO authentifié:', data);
      
      // 4. Créer une commande de test
      setTimeout(async () => {
        console.log('\n4️⃣ Création d\'une commande de test...');
        try {
          const orderResponse = await axios.post(`${BASE_URL}/api/public/qbos55dx/orders`, {
            product_id: 35,
            customer_name: 'Test Notification Socket.IO',
            customer_phone: '771234567',
            customer_address: 'Test Address',
            quantity: 1,
            payment_method: 'cash'
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
    });

    socket.on('authentication_error', (error) => {
      console.error('❌ Erreur d\'authentification Socket.IO:', error);
    });

    socket.on('new_order', (data) => {
      console.log('🛒 Nouvelle commande reçue via Socket.IO:', data);
    });

    socket.on('order_status_update', (data) => {
      console.log('📊 Mise à jour de statut reçue via Socket.IO:', data);
    });

    socket.on('notification', (data) => {
      console.log('🔔 Notification générale reçue via Socket.IO:', data);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO déconnecté:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.IO:', error);
    });

    // 6. Attendre un peu puis fermer
    setTimeout(() => {
      console.log('\n6️⃣ Fermeture du test...');
      socket.disconnect();
      process.exit(0);
    }, 15000);

  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Lancer le test
testNotifications(); 
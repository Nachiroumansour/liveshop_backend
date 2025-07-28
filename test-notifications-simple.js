const io = require('socket.io-client');

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const SELLER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJZCI6MiwiaWF0IjoxNzUyNzkwNTgwLCJleHAiOjE3NTUzODI1ODB9.A4er3sKrpeA_Xbi-ASC-d1fA6ohXR-tl4qdaDxDoIOM'; // Token valide pour Mamadou Ba (ID 2)

console.log('🧪 Test des notifications WebSocket');
console.log('=====================================');

// Connexion WebSocket
const socket = io(BACKEND_URL, {
  transports: ['websocket', 'polling'],
  timeout: 10000
});

// Gestion des événements
socket.on('connect', () => {
  console.log('✅ Connecté au serveur WebSocket');
  
  // Authentification
  socket.emit('authenticate', { token: SELLER_TOKEN });
});

socket.on('authenticated', (data) => {
  console.log('✅ Authentification réussie:', data.message);
  console.log('🎯 Vendeur:', data.seller.name);
  
  // Écouter les nouvelles commandes
  socket.on('new_order', (data) => {
    console.log('🛒 NOUVELLE COMMANDE REÇUE:');
    console.log('   Client:', data.order.customer_name);
    console.log('   Produit:', data.order.product.name);
    console.log('   Quantité:', data.order.quantity);
    console.log('   Prix:', data.order.total_price, 'FCFA');
    console.log('   Message:', data.message);
  });
  
  // Écouter les mises à jour de statut
  socket.on('order_status_update', (data) => {
    console.log('📊 MISE À JOUR DE STATUT REÇUE:');
    console.log('   Commande ID:', data.id);
    console.log('   Nouveau statut:', data.status);
    console.log('   Client:', data.customer_name);
    console.log('   Produit:', data.product_name);
  });
  
  console.log('🎧 En attente de notifications...');
  console.log('💡 Pour tester, créez une commande depuis le web client');
});

socket.on('error', (error) => {
  console.error('❌ Erreur WebSocket:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Déconnecté:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion:', error);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du test...');
  socket.disconnect();
  process.exit(0);
});

console.log('🚀 Test démarré. Appuyez sur Ctrl+C pour arrêter.'); 
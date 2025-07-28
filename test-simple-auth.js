const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

const WS_URL = 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET || 'liveshop_secret_key';

async function testAuth() {
  console.log('🔍 Test d\'authentification simple...');
  
  // Générer un token pour le vendeur ID 1
  const token = jwt.sign(
    { sellerId: 1 }, 
    JWT_SECRET, 
    { expiresIn: '30d' }
  );
  
  console.log('🔑 Token généré:', token.substring(0, 20) + '...');
  
  return new Promise((resolve, reject) => {
    const socket = io(WS_URL);
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
      console.log('🔐 Envoi du token...');
      socket.emit('authenticate', { token });
    });
    
    socket.on('authenticated', (data) => {
      console.log('🎉 Authentification réussie!');
      console.log('📱 Vendeur:', data.seller.name);
      console.log('🆔 ID:', data.seller.id);
      socket.disconnect();
      resolve(true);
    });
    
    socket.on('error', (error) => {
      console.log('❌ Erreur d\'authentification:', error.message);
      socket.disconnect();
      reject(error);
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 WebSocket déconnecté');
    });
    
    // Timeout
    setTimeout(() => {
      console.log('⏰ Timeout - Aucune réponse');
      socket.disconnect();
      reject(new Error('Timeout'));
    }, 5000);
  });
}

testAuth()
  .then(() => {
    console.log('✅ Test réussi!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ Test échoué:', error.message);
    process.exit(1);
  }); 
const io = require('socket.io-client');
const { Seller } = require('./src/models');

const JWT_SECRET = 'liveshop_secret_key_2025_dev';

async function checkMobileConnection() {
  try {
    console.log('🔍 Vérification de la connexion mobile...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    console.log('✅ Mamadou Ba:', mamadou.name);
    
    // 2. Générer le token correct
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ sellerId: mamadou.id }, JWT_SECRET, { expiresIn: '30d' });
    
    console.log('\n🔑 TOKEN CORRECT POUR L\'APP MOBILE:');
    console.log('=' .repeat(80));
    console.log(token);
    console.log('=' .repeat(80));
    
    // 3. Instructions pour l'utilisateur
    console.log('\n📱 INSTRUCTIONS POUR CORRIGER L\'APP MOBILE:');
    console.log('=' .repeat(60));
    console.log('1. Ouvrez l\'app mobile dans le navigateur');
    console.log('2. Appuyez sur F12 pour ouvrir la console');
    console.log('3. Copiez et collez cette commande:');
    console.log(`localStorage.setItem("liveshop_token", "${token}")`);
    console.log('4. Appuyez sur Entrée');
    console.log('5. Rechargez la page (F5)');
    console.log('6. Vous devriez maintenant être connecté et voir les notifications!');
    console.log('=' .repeat(60));
    
    // 4. Test de connexion
    console.log('\n🧪 Test de connexion WebSocket...');
    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
      socket.emit('authenticate', { token });
    });
    
    socket.on('authenticated', (data) => {
      console.log('✅ WebSocket authentifié pour Mamadou Ba');
      console.log('📱 Vendeur connecté:', data.seller.name);
      
      // Envoyer une notification de test
      setTimeout(() => {
        console.log('\n🔔 Envoi d\'une notification de test...');
        socket.emit('new_order', {
          order: {
            id: 999,
            customer_name: 'Test Mobile',
            total_price: 25000,
            product: { name: 'Produit Test' }
          }
        });
        
        console.log('✅ Notification de test envoyée');
        console.log('📱 Vérifiez si vous la voyez dans l\'app mobile!');
        
        setTimeout(() => {
          socket.disconnect();
          console.log('🔌 WebSocket déconnecté');
        }, 2000);
      }, 1000);
    });
    
    socket.on('error', (error) => {
      console.log('❌ Erreur WebSocket:', error.message);
    });
    
    // 5. Vérifier les connexions actives
    console.log('\n📊 Vérification des connexions actives...');
    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        const health = await response.json();
        console.log('✅ Serveur en ligne');
        console.log('📡 Connexions actives:', health.connectedSellers);
      } catch (error) {
        console.log('❌ Impossible de vérifier le serveur');
      }
    }, 3000);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  // Attendre avant de quitter
  setTimeout(() => {
    process.exit(0);
  }, 8000);
}

checkMobileConnection(); 
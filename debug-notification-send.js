const { Seller, Product } = require('./src/models');

async function debugNotificationSend() {
  try {
    console.log('🔍 Débogage de l\'envoi de notification...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    console.log('✅ Mamadou Ba:', mamadou.name);
    
    // 2. Vérifier si global.notifySeller existe
    console.log('\n🔧 Vérification de global.notifySeller:');
    console.log('   - Existe:', !!global.notifySeller);
    console.log('   - Type:', typeof global.notifySeller);
    
    if (global.notifySeller) {
      console.log('   - Fonction disponible');
      
      // 3. Vérifier les connexions WebSocket actives
      console.log('\n🔌 Connexions WebSocket actives:');
      if (global.sellerConnections) {
        const connections = global.sellerConnections.get(mamadou.id);
        console.log('   - Connexions pour Mamadou Ba:', connections ? connections.size : 0);
        
        if (connections && connections.size > 0) {
          console.log('   - Connexions actives trouvées');
          
          // 4. Tester l'envoi de notification
          console.log('\n📤 Test d\'envoi de notification...');
          const testData = {
            order: {
              id: 999,
              customer_name: 'Test Client',
              total_price: 1000
            }
          };
          
          try {
            global.notifySeller(mamadou.id, 'new_order', testData);
            console.log('✅ Notification envoyée avec succès');
          } catch (error) {
            console.log('❌ Erreur lors de l\'envoi:', error.message);
          }
        } else {
          console.log('   - Aucune connexion active pour Mamadou Ba');
          console.log('   - Le problème: L\'app mobile n\'est pas connectée au WebSocket');
        }
      } else {
        console.log('   - global.sellerConnections non disponible');
      }
    } else {
      console.log('   - global.notifySeller non disponible');
      console.log('   - Le problème: La fonction de notification n\'est pas initialisée');
    }
    
    // 5. Instructions pour l'utilisateur
    console.log('\n📱 INSTRUCTIONS POUR L\'UTILISATEUR:');
    console.log('=' .repeat(60));
    console.log('Le problème est que l\'app mobile n\'est pas connectée au WebSocket');
    console.log('Pour résoudre:');
    console.log('1. Ouvrez l\'app mobile dans le navigateur');
    console.log('2. Connectez-vous avec Mamadou Ba (+221772345678 / 1234)');
    console.log('3. Vérifiez que vous êtes connecté (statut WebSocket)');
    console.log('4. Puis relancez ce test');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

debugNotificationSend(); 
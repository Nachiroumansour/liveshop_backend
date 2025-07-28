const axios = require('axios');
const { Seller, Product } = require('./src/models');

const BASE_URL = 'http://localhost:3001';

async function forceNotificationTest() {
  try {
    console.log('🚀 Test forcé de notification en temps réel...');
    
    // 1. Vérifier Mamadou Ba
    const mamadou = await Seller.findByPk(2);
    console.log('✅ Mamadou Ba:', mamadou.name);
    console.log('🔗 Link ID:', mamadou.public_link_id);
    
    // 2. Vérifier ses produits
    const products = await Product.findAll({
      where: { seller_id: mamadou.id },
      order: [['created_at', 'DESC']],
      limit: 1
    });
    
    if (products.length === 0) {
      console.log('❌ Aucun produit trouvé pour Mamadou Ba');
      return;
    }
    
    const product = products[0];
    console.log('📦 Produit utilisé:', product.name, '(ID:', product.id, ')');
    
    // 3. Créer une commande via l'API publique (simulation client)
    console.log('\n🛒 Création d\'une commande via l\'API publique...');
    const orderData = {
      customer_name: 'Client Test Notification',
      customer_phone: '+2250701234567',
      customer_address: 'Adresse Test Notification',
      payment_method: 'cash',
      product_id: product.id,
      quantity: 1
    };
    
    try {
      const response = await axios.post(`${BASE_URL}/api/public/${mamadou.public_link_id}/orders`, orderData);
      
      if (response.status === 201) {
        const order = response.data;
        console.log('✅ Commande créée via API:', order.id);
        console.log('📦 Notification envoyée: Oui');
        
        // 4. Attendre un peu pour que la notification soit traitée
        console.log('\n⏳ Attente de traitement de la notification...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 5. Vérifier les notifications en base
        console.log('\n📊 Vérification des notifications en base...');
        const { Notification } = require('./src/models');
        
        const notifications = await Notification.findAll({
          where: { 
            seller_id: mamadou.id,
            type: 'new_order'
          },
          order: [['created_at', 'DESC']],
          limit: 3
        });
        
        console.log(`📦 ${notifications.length} notification(s) trouvée(s):`);
        notifications.forEach((notif, index) => {
          console.log(`\n${index + 1}. Notification:`);
          console.log(`   - ID: ${notif.id}`);
          console.log(`   - Type: ${notif.type}`);
          console.log(`   - Titre: ${notif.title}`);
          console.log(`   - Message: ${notif.message}`);
          console.log(`   - Envoyée: ${notif.sent ? 'Oui' : 'Non'}`);
          console.log(`   - Créée: ${notif.created_at}`);
        });
        
        console.log('\n🎯 INSTRUCTIONS POUR L\'UTILISATEUR:');
        console.log('============================================================');
        console.log('1. Assurez-vous que l\'app mobile est ouverte et connectée');
        console.log('2. Vérifiez dans la console que vous voyez "WebSocket connecté"');
        console.log('3. Si vous ne voyez pas la notification, rechargez la page (F5)');
        console.log('4. La notification devrait apparaître en temps réel!');
        console.log('============================================================');
        
      } else {
        console.log('❌ Erreur création commande:', response.status);
      }
      
    } catch (error) {
      console.error('❌ Erreur API:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur test forcé:', error);
  }
}

// Exécuter le test
forceNotificationTest(); 
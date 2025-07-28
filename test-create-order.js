const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const SELLER_LINK_ID = 'qbos55dx'; // Link ID de Mamadou Ba

// Données de test pour la commande
const orderData = {
  product_id: 1, // Premier produit de Mamadou Ba
  customer_name: 'Client Test',
  customer_phone: '+221771234567',
  customer_address: '123 Rue Test, Dakar',
  quantity: 2,
  payment_method: 'mobile_money',
  comment: 'Commande de test pour vérifier les notifications'
};

console.log('🧪 Test de création de commande');
console.log('=====================================');
console.log('📦 Données de commande:');
console.log('   Client:', orderData.customer_name);
console.log('   Produit ID:', orderData.product_id);
console.log('   Quantité:', orderData.quantity);
console.log('   Méthode de paiement:', orderData.payment_method);
console.log('');

// Fonction pour créer une commande
const createOrder = async () => {
  try {
    console.log('📡 Envoi de la commande...');
    
    const response = await axios.post(
      `${BACKEND_URL}/api/public/${SELLER_LINK_ID}/orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ Commande créée avec succès!');
    console.log('📋 Détails de la commande:');
    console.log('   ID:', response.data.order.id);
    console.log('   Prix total:', response.data.order.total_price, 'FCFA');
    console.log('   Statut:', response.data.order.status);
    console.log('   Date:', new Date(response.data.order.created_at).toLocaleString());
    console.log('');
    console.log('🎯 Si le test WebSocket fonctionne, vous devriez voir une notification!');

    return response.data;

  } catch (error) {
    console.error('❌ Erreur lors de la création de la commande:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.error || error.response.data);
    } else if (error.request) {
      console.error('   Erreur de connexion au serveur');
    } else {
      console.error('   Erreur:', error.message);
    }
    
    return null;
  }
};

// Fonction pour vérifier les produits disponibles
const checkProducts = async () => {
  try {
    console.log('🔍 Vérification des produits disponibles...');
    
    const response = await axios.get(
      `${BACKEND_URL}/api/public/${SELLER_LINK_ID}/products`,
      { timeout: 5000 }
    );

    console.log('✅ Produits trouvés:', response.data.products.length);
    response.data.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.price} FCFA (ID: ${product.id})`);
    });
    
    // Mettre à jour l'ID du produit si nécessaire
    if (response.data.products.length > 0) {
      orderData.product_id = response.data.products[0].id;
      console.log(`📝 Utilisation du produit ID: ${orderData.product_id}`);
    }
    
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification des produits:', error.message);
  }
};

// Exécution du test
const runTest = async () => {
  console.log('🚀 Démarrage du test...\n');
  
  // Vérifier les produits d'abord
  await checkProducts();
  
  // Créer la commande
  await createOrder();
  
  console.log('🏁 Test terminé');
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erreur non gérée:', reason);
});

// Exécuter le test
runTest(); 
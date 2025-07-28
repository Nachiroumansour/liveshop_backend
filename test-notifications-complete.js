const { Sequelize } = require('sequelize');
const path = require('path');

// Configuration de la base de données
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Modèle Order avec les noms de colonnes exacts
const Order = sequelize.define('Order', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seller_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  customer_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  customer_phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  customer_address: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  total_price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  payment_method: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'wave'
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false
});

// Modèle Product avec les noms de colonnes exacts
const Product = sequelize.define('Product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  image_url: {
    type: Sequelize.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: false
});

// Définir l'association
Order.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

async function testCompleteNotifications() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
    
    // Vérifier si le backend est en cours d'exécution
    const http = require('http');
    
    const checkBackend = () => {
      return new Promise((resolve) => {
        const req = http.get('http://localhost:3001/api/health', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const health = JSON.parse(data);
              resolve(health);
            } catch (e) {
              resolve(null);
            }
          });
        });
        
        req.on('error', () => resolve(null));
        req.setTimeout(3000, () => resolve(null));
      });
    };
    
    const health = await checkBackend();
    if (!health) {
      console.log('❌ Le backend n\'est pas en cours d\'exécution sur le port 3001');
      console.log('💡 Démarrez le backend avec: npm start');
      return;
    }
    
    console.log('✅ Backend en cours d\'exécution');
    console.log(`📊 Vendeurs connectés: ${health.connectedSellers}`);
    
    if (health.connectedSellers === 0) {
      console.log('⚠️ Aucun vendeur connecté. Connectez-vous dans l\'app mobile vendeur.');
      console.log('💡 Identifiants Mamadou Ba: +221772345678 / 1234');
    }
    
    console.log('\n🔔 Test des notifications complètes...');
    console.log('📱 Assurez-vous que l\'app mobile vendeur est connectée et ouverte');
    console.log('🔊 Vérifiez que le son est activé sur votre appareil');
    console.log('🎤 Vérifiez que les notifications vocales sont activées');
    
    // Créer une commande de test pour Mamadou Ba (seller_id: 2)
    const testOrder = await Order.create({
      seller_id: 2,
      product_id: 23, // Premier produit de Mamadou
      customer_name: 'Client Test Notifications',
      customer_phone: '+221701234567',
      customer_address: '123 Rue Test, Dakar, Sénégal',
      quantity: 1,
      total_price: 45000,
      payment_method: 'wave',
      status: 'pending'
    });
    
    console.log('\n✅ Commande de test créée:', testOrder.id);
    
    // Récupérer les détails de la commande avec le produit
    const orderWithProduct = await Order.findOne({
      where: { id: testOrder.id },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'price', 'image_url']
      }]
    });
    
    console.log('📋 Détails de la commande:');
    console.log('- Client:', orderWithProduct.customer_name);
    console.log('- Produit:', orderWithProduct.product?.name || 'Produit inconnu');
    console.log('- Quantité:', orderWithProduct.quantity);
    console.log('- Prix total:', orderWithProduct.total_price, 'FCFA');
    console.log('- Méthode de paiement:', orderWithProduct.payment_method);
    
    console.log('\n🔔 Notification envoyée au vendeur Mamadou Ba (ID: 2)');
    console.log('📱 Vérifiez dans l\'app mobile vendeur:');
    console.log('   1. Notification toast (message popup)');
    console.log('   2. Son de notification (double bip)');
    console.log('   3. Notification vocale (message parlé)');
    
    // Attendre 5 secondes pour laisser le temps de voir/hearer les notifications
    console.log('\n⏳ Attente de 5 secondes...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Nettoyer la commande de test
    await testOrder.destroy();
    console.log('🧹 Commande de test supprimée');
    
    console.log('\n✅ Test terminé !');
    console.log('💡 Si vous n\'avez pas reçu les notifications, vérifiez:');
    console.log('   - L\'app mobile est-elle connectée ?');
    console.log('   - Le son est-il activé ?');
    console.log('   - Les notifications vocales sont-elles activées ?');
    console.log('   - Le navigateur supporte-t-il la synthèse vocale ?');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    await sequelize.close();
  }
}

testCompleteNotifications(); 
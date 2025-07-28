require('dotenv').config();
const { Sequelize } = require('sequelize');
const sqlite3 = require('sqlite3');
const path = require('path');

// Configuration SQLite (source)
const sqliteDb = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'));

// Configuration PostgreSQL (destination)
const postgresDb = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'liveshop_link',
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Créer les modèles PostgreSQL séparément
const { DataTypes } = require('sequelize');

const Seller = postgresDb.define('Seller', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  public_link_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  pin_hash: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'sellers'
});

const Product = postgresDb.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_url: {
    type: DataTypes.TEXT, // Correction ici
    allowNull: true
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'products'
});

const Order = postgresDb.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  customer_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  payment_proof_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'orders'
});

const Live = postgresDb.define('Live', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'lives'
});

const LiveProduct = postgresDb.define('LiveProduct', {
  liveId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'live_products'
});

const Notification = postgresDb.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'notifications'
});

const OTP = postgresDb.define('OTP', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'otps'
});

async function migrateData() {
  try {
    console.log('🔄 Début de la migration SQLite → PostgreSQL...');
    
    // 1. Synchroniser les modèles PostgreSQL
    await postgresDb.sync({ force: true });
    console.log('✅ Modèles PostgreSQL synchronisés (force: true)');
    
    // 2. Migrer les vendeurs
    const sellers = await getAllFromSqlite('sellers');
    for (const seller of sellers) {
      await Seller.create(seller);
    }
    console.log(`✅ ${sellers.length} vendeurs migrés`);
    
    // 3. Migrer les produits
    const products = await getAllFromSqlite('products');
    for (const product of products) {
      await Product.create(product);
    }
    console.log(`✅ ${products.length} produits migrés`);
    
    // 4. Migrer les lives
    const lives = await getAllFromSqlite('lives');
    for (const live of lives) {
      await Live.create(live);
    }
    console.log(`✅ ${lives.length} lives migrés`);
    
    // 5. Migrer les commandes
    const orders = await getAllFromSqlite('orders');
    for (const order of orders) {
      await Order.create(order);
    }
    console.log(`✅ ${orders.length} commandes migrées`);
    
    // 6. Migrer les associations live_products
    const liveProducts = await getAllFromSqlite('live_products');
    for (const lp of liveProducts) {
      await LiveProduct.create(lp);
    }
    console.log(`✅ ${liveProducts.length} associations live_products migrées`);
    
    // 7. Migrer les notifications
    const notifications = await getAllFromSqlite('notifications');
    for (const notification of notifications) {
      await Notification.create(notification);
    }
    console.log(`✅ ${notifications.length} notifications migrées`);
    
    // 8. Migrer les OTPs
    const otps = await getAllFromSqlite('otps');
    for (const otp of otps) {
      await OTP.create(otp);
    }
    console.log(`✅ ${otps.length} OTPs migrés`);
    
    console.log('🎉 Migration terminée avec succès !');
    
    // Afficher les statistiques finales
    const finalStats = await getFinalStats();
    console.log('\n📊 Statistiques finales PostgreSQL:');
    console.log(`   Vendeurs: ${finalStats.sellers}`);
    console.log(`   Produits: ${finalStats.products}`);
    console.log(`   Lives: ${finalStats.lives}`);
    console.log(`   Commandes: ${finalStats.orders}`);
    console.log(`   Associations live_products: ${finalStats.liveProducts}`);
    console.log(`   Notifications: ${finalStats.notifications}`);
    console.log(`   OTPs: ${finalStats.otps}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await postgresDb.close();
    sqliteDb.close();
  }
}

function getAllFromSqlite(tableName) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        console.log(`⚠️ Table ${tableName} non trouvée ou vide`);
        resolve([]);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getFinalStats() {
  return {
    sellers: await Seller.count(),
    products: await Product.count(),
    lives: await Live.count(),
    orders: await Order.count(),
    liveProducts: await LiveProduct.count(),
    notifications: await Notification.count(),
    otps: await OTP.count()
  };
}

// Vérifier que les variables d'environnement sont définies
if (!process.env.DB_HOST) {
  console.error('❌ Variables d\'environnement PostgreSQL manquantes !');
  console.log('📝 Veuillez définir :');
  console.log('   DB_HOST=localhost');
  console.log('   DB_USER=macbook');
  console.log('   DB_PASSWORD=');
  console.log('   DB_NAME=liveshop_link');
  process.exit(1);
}

migrateData(); 
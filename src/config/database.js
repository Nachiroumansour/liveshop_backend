const { Sequelize } = require('sequelize');
const path = require('path');

// Configuration de la base de données
const getDatabaseConfig = () => {
  // Si les variables PostgreSQL sont définies, utiliser PostgreSQL
  if (process.env.DB_HOST && process.env.DB_PASSWORD) {
    return {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'liveshop_link',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      },
      // Configuration pour Vercel
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    };
  }
  
  // Sinon, utiliser SQLite (fallback)
  return {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  };
};

const sequelize = new Sequelize(getDatabaseConfig());

// Test de la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    const dialect = sequelize.getDialect();
    console.log(`✅ Connexion à la base de données ${dialect} établie avec succès.`);
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
  }
};

module.exports = { sequelize, testConnection };


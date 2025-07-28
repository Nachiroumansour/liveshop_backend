const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seller = sequelize.define('Seller', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  public_link_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  pin_hash: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Hash du code PIN à 4 chiffres'
  }
}, {
  tableName: 'sellers',
  hooks: {
    beforeCreate: async (seller) => {
      // Générer un ID de lien public unique
      seller.public_link_id = await generateUniquePublicLinkId();
    }
  }
});

// Fonction pour générer un ID de lien public unique
const generateUniquePublicLinkId = async () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let linkId;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    // Générer un ID de 10 caractères pour plus de combinaisons
    linkId = '';
    for (let i = 0; i < 10; i++) {
      linkId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Vérifier l'unicité
    const existingSeller = await Seller.findOne({ where: { public_link_id: linkId } });
    if (!existingSeller) {
      return linkId;
    }
    
    attempts++;
  }
  
  // Si on n'a pas trouvé après maxAttempts, utiliser un timestamp
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `v${timestamp}${randomSuffix}`;
};

module.exports = Seller;


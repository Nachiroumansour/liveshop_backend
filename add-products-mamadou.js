const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Configuration de la base de données
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Modèle Product avec les noms de colonnes exacts
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'products',
  timestamps: false // Désactiver les timestamps automatiques
});

// Produits pour Mamadou Ba (seller_id: 2)
const productsForMamadou = [
  // Vêtements
  {
    seller_id: 2,
    name: "Boubou homme traditionnel",
    price: 45000,
    description: "Boubou traditionnel en coton, broderies dorées, plusieurs tailles disponibles.",
    image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400",
    stock_quantity: 8,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Chemise africaine wax",
    price: 22000,
    description: "Chemise élégante en tissu wax, motifs colorés, coupe moderne.",
    image_url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400",
    stock_quantity: 12,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Pantalon slim coton",
    price: 18000,
    description: "Pantalon slim en coton doux, coupe moderne, plusieurs coloris.",
    image_url: "https://images.unsplash.com/photo-1526178613658-3f1622045557?w=400",
    stock_quantity: 15,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Veste en cuir vintage",
    price: 85000,
    description: "Veste en cuir véritable, style vintage, très tendance.",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    stock_quantity: 3,
    is_pinned: true
  },
  {
    seller_id: 2,
    name: "T-shirt graphique",
    price: 12000,
    description: "T-shirt avec design graphique, coton 100%, coupe confortable.",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    stock_quantity: 20,
    is_pinned: false
  },
  
  // Chaussures
  {
    seller_id: 2,
    name: "Sneakers urbaines",
    price: 35000,
    description: "Sneakers tendance, semelle épaisse, confort optimal.",
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    stock_quantity: 10,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Mocassins en cuir",
    price: 42000,
    description: "Mocassins élégants en cuir véritable, semelle souple.",
    image_url: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400",
    stock_quantity: 6,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Sandales en cuir artisanal",
    price: 18000,
    description: "Sandales plates en cuir, fabrication artisanale locale.",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    stock_quantity: 14,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Bottes de travail",
    price: 55000,
    description: "Bottes robustes pour le travail, semelle antidérapante.",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    stock_quantity: 4,
    is_pinned: false
  },
  
  // Accessoires
  {
    seller_id: 2,
    name: "Ceinture en cuir",
    price: 15000,
    description: "Ceinture en cuir véritable, boucle métallique, plusieurs tailles.",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    stock_quantity: 8,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Portefeuille en cuir",
    price: 25000,
    description: "Portefeuille élégant en cuir, plusieurs compartiments.",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    stock_quantity: 5,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Chapeau panama",
    price: 28000,
    description: "Chapeau panama authentique, protection solaire, style élégant.",
    image_url: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400",
    stock_quantity: 7,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Montre classique",
    price: 120000,
    description: "Montre analogique classique, bracelet en cuir, design intemporel.",
    image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    stock_quantity: 2,
    is_pinned: true
  },
  {
    seller_id: 2,
    name: "Lunettes de soleil",
    price: 35000,
    description: "Lunettes de soleil tendance, protection UV, plusieurs modèles.",
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    stock_quantity: 9,
    is_pinned: false
  },
  {
    seller_id: 2,
    name: "Sac à dos urbain",
    price: 38000,
    description: "Sac à dos moderne, plusieurs poches, idéal pour la ville.",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    stock_quantity: 6,
    is_pinned: false
  }
];

async function addProductsForMamadou() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
    
    console.log('\n🛍️ Ajout des produits pour Mamadou Ba...');
    
    for (const productData of productsForMamadou) {
      const product = await Product.create(productData);
      console.log(`✅ Ajouté: ${product.name} - ${product.price} FCFA`);
    }
    
    console.log('\n🎉 Tous les produits ont été ajoutés avec succès !');
    console.log(`📊 Total: ${productsForMamadou.length} produits ajoutés`);
    
    // Vérifier les produits ajoutés
    const mamadouProducts = await Product.findAll({
      where: { seller_id: 2 },
      attributes: ['id', 'name', 'price', 'stock_quantity', 'is_pinned']
    });
    
    console.log('\n📋 Produits de Mamadou Ba:');
    mamadouProducts.forEach(product => {
      const pinned = product.is_pinned ? '⭐' : '';
      console.log(`${pinned} ${product.name} - ${product.price} FCFA (Stock: ${product.stock_quantity})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des produits:', error.message);
  } finally {
    await sequelize.close();
  }
}

addProductsForMamadou(); 
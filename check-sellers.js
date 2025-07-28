const { sequelize } = require('./src/config/database');
const { Seller } = require('./src/models');

async function checkSellers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    const sellers = await Seller.findAll({
      attributes: ['id', 'name', 'phone_number', 'public_link_id']
    });

    console.log(`📊 ${sellers.length} vendeurs trouvés:`);
    sellers.forEach(seller => {
      console.log(`  - ID: ${seller.id}, Nom: ${seller.name}, Téléphone: ${seller.phone_number}`);
    });

    if (sellers.length === 0) {
      console.log('⚠️ Aucun vendeur trouvé. Créons Mamadou Ba...');
      
      const mamadou = await Seller.create({
        name: 'Mamadou Ba',
        phone_number: '+221772345678',
        public_link_id: 'qbos55dx'
      });
      
      console.log('✅ Mamadou Ba créé avec l\'ID:', mamadou.id);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

checkSellers(); 
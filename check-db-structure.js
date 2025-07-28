const { Sequelize } = require('sequelize');
const path = require('path');

// Configuration de la base de données
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

async function checkDatabaseStructure() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
    
    // Vérifier les tables existantes
    const tables = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'", {
      type: Sequelize.QueryTypes.SELECT
    });
    
    console.log('\n📋 Tables dans la base de données:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
    });
    
    // Vérifier la structure de la table sellers
    if (tables.some(t => t.name === 'sellers')) {
      console.log('\n🔍 Structure de la table sellers:');
      const columns = await sequelize.query("PRAGMA table_info(sellers)", {
        type: Sequelize.QueryTypes.SELECT
      });
      
      columns.forEach(col => {
        console.log(`- ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'}`);
      });
      
      // Vérifier les données
      const sellers = await sequelize.query("SELECT * FROM sellers", {
        type: Sequelize.QueryTypes.SELECT
      });
      
      console.log('\n📊 Données des vendeurs:');
      if (sellers.length === 0) {
        console.log('❌ Aucun vendeur trouvé dans la base de données');
      } else {
        sellers.forEach((seller, index) => {
          console.log(`\n${index + 1}. ${JSON.stringify(seller, null, 2)}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabaseStructure(); 
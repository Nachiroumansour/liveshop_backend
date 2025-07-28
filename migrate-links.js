const { Seller, Live } = require('./src/models');

async function migrateLinks() {
  try {
    console.log('🔄 Début de la migration des liens...');
    
    // Migrer les liens des vendeurs existants
    const sellers = await Seller.findAll();
    console.log(`📊 Migration de ${sellers.length} vendeurs...`);
    
    for (const seller of sellers) {
      // Vérifier si le lien actuel est valide
      const currentLink = seller.public_link_id;
      const linkIdRegex = /^[a-z0-9]{8,12}$/;
      
      if (!linkIdRegex.test(currentLink)) {
        console.log(`⚠️ Lien invalide pour ${seller.name}: ${currentLink}`);
        
        // Générer un nouveau lien
        const newLink = await generateUniquePublicLinkId();
        await seller.update({ public_link_id: newLink });
        
        console.log(`✅ ${seller.name}: ${currentLink} → ${newLink}`);
      } else {
        console.log(`✅ ${seller.name}: ${currentLink} (valide)`);
      }
    }
    
    // Migrer les slugs des lives existants
    const lives = await Live.findAll();
    console.log(`📺 Migration de ${lives.length} lives...`);
    
    for (const live of lives) {
      const currentSlug = live.slug;
      
      // Vérifier si le slug est unique
      const existingLive = await Live.findOne({ 
        where: { slug: currentSlug, id: { [require('sequelize').Op.ne]: live.id } }
      });
      
      if (existingLive) {
        console.log(`⚠️ Slug en conflit pour ${live.title}: ${currentSlug}`);
        
        // Générer un nouveau slug
        const newSlug = await generateUniqueSlug(live.title);
        await live.update({ slug: newSlug });
        
        console.log(`✅ ${live.title}: ${currentSlug} → ${newSlug}`);
      } else {
        console.log(`✅ ${live.title}: ${currentSlug} (unique)`);
      }
    }
    
    console.log('✅ Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

async function generateUniquePublicLinkId() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let linkId;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    linkId = '';
    for (let i = 0; i < 10; i++) {
      linkId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const existingSeller = await Seller.findOne({ where: { public_link_id: linkId } });
    if (!existingSeller) {
      return linkId;
    }
    attempts++;
  }
  
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `v${timestamp}${randomSuffix}`;
}

async function generateUniqueSlug(title) {
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
  
  let slug = baseSlug;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const existingLive = await Live.findOne({ where: { slug } });
    if (!existingLive) {
      return slug;
    }
    
    const suffix = Math.random().toString(36).substring(2, 6);
    slug = `${baseSlug}-${suffix}`;
    attempts++;
  }
  
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

// Exécuter la migration
migrateLinks(); 
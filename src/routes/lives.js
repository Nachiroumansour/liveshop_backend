const express = require('express');
const router = express.Router();
const { Live, LiveProduct, Product } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

// Créer un live
router.post('/', async (req, res) => {
  try {
    const { title, date, sellerId } = req.body;
    
    // Générer un slug unique
    const baseSlug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .substring(0, 50); // Limiter la longueur
    
    let slug = baseSlug;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Vérifier l'unicité du slug
    while (attempts < maxAttempts) {
      const existingLive = await Live.findOne({ where: { slug } });
      if (!existingLive) {
        break;
      }
      
      // Ajouter un suffixe unique
      const suffix = Math.random().toString(36).substring(2, 6);
      slug = `${baseSlug}-${suffix}`;
      attempts++;
    }
    
    // Si on n'a pas trouvé après maxAttempts, utiliser un timestamp
    if (attempts >= maxAttempts) {
      const timestamp = Date.now().toString(36);
      slug = `${baseSlug}-${timestamp}`;
    }
    
    const live = await Live.create({ title, date, sellerId, slug });
    res.status(201).json(live);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lister les lives d'un vendeur
router.get('/', async (req, res) => {
  try {
    const { sellerId } = req.query;
    if (!sellerId) return res.status(400).json({ error: 'sellerId requis' });
    const lives = await Live.findAll({ where: { sellerId }, order: [['date', 'DESC']] });
    res.json(lives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Associer des produits à un live
router.post('/:liveId/products', async (req, res) => {
  try {
    const { productIds } = req.body; // tableau d'IDs
    const { liveId } = req.params;
    if (!Array.isArray(productIds)) return res.status(400).json({ error: 'productIds doit être un tableau' });
    // Supprimer les associations existantes
    await LiveProduct.destroy({ where: { liveId } });
    // Créer les nouvelles associations
    const bulk = productIds.map(productId => ({ liveId, productId }));
    await LiveProduct.bulkCreate(bulk);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retirer un produit d'un live
router.delete('/:liveId/products/:productId', async (req, res) => {
  try {
    const { liveId, productId } = req.params;
    await LiveProduct.destroy({ where: { liveId, productId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lister les produits d'un live
router.get('/:liveId/products', async (req, res) => {
  try {
    const { liveId } = req.params;
    const live = await Live.findByPk(liveId, {
      include: [{ model: Product }]
    });
    if (!live) return res.status(404).json({ error: 'Live non trouvé' });
    res.json(live.Products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lister les commandes d'un live
router.get('/:liveId/orders', async (req, res) => {
  try {
    const { liveId } = req.params;
    // Récupérer les produits associés à ce live
    const live = await Live.findByPk(liveId, { include: [{ model: Product }] });
    if (!live) return res.status(404).json({ error: 'Live non trouvé' });
    const productIds = live.Products.map(p => p.id);
    // Récupérer les commandes pour ces produits
    const orders = await require('../models').Order.findAll({
      where: { product_id: productIds.length > 0 ? productIds : [-1] },
      order: [['created_at', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rapport CSV des ventes d'un live
router.get('/:liveId/report', async (req, res) => {
  try {
    const { liveId } = req.params;
    const live = await Live.findByPk(liveId, { include: [{ model: Product }] });
    if (!live) return res.status(404).json({ error: 'Live non trouvé' });
    const productIds = live.Products.map(p => p.id);
    const orders = await require('../models').Order.findAll({
      where: { product_id: productIds.length > 0 ? productIds : [-1] },
      order: [['created_at', 'DESC']]
    });
    // Formatage CSV
    const fields = [
      { label: 'Date', value: 'created_at' },
      { label: 'Client', value: 'customer_name' },
      { label: 'Téléphone', value: 'customer_phone' },
      { label: 'Produit', value: 'product_id' },
      { label: 'Quantité', value: 'quantity' },
      { label: 'Total', value: 'total_price' },
      { label: 'Statut', value: 'status' }
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(orders.map(o => o.toJSON()));
    res.header('Content-Type', 'text/csv');
    res.attachment(`rapport-live-${liveId}.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
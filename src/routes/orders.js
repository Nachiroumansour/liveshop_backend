const express = require('express');
const { Order, Product, Seller } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Récupérer toutes les commandes du vendeur connecté
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = { seller_id: req.seller.id };
    if (status) {
      whereClause.status = status;
    }

    // Compter le total des commandes
    const totalOrders = await Order.count({ where: whereClause });

    const orders = await Order.findAll({
      where: whereClause,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image_url']
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    res.json({
      orders: orders.map(order => ({
        id: order.id,
        product_id: order.product_id,
        seller_id: order.seller_id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        quantity: order.quantity,
        total_price: order.total_price,
        payment_method: order.payment_method,
        payment_proof_url: order.payment_proof_url,
        status: order.status,
        comment: order.comment,
        created_at: order.created_at,
        updated_at: order.updated_at,
        product: order.product ? {
          id: order.product.id,
          name: order.product.name,
          price: order.product.price,
          image_url: order.product.image_url
        } : null
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalOrders: totalOrders,
        ordersPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPreviousPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// Mettre à jour le statut d'une commande
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Statut requis'
      });
    }

    if (!['pending', 'paid', 'delivered'].includes(status)) {
      return res.status(400).json({
        error: 'Statut invalide'
      });
    }

    const order = await Order.findOne({
      where: { 
        id: orderId, 
        seller_id: req.seller.id 
      },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image_url']
      }]
    });

    if (!order) {
      return res.status(404).json({
        error: 'Commande non trouvée'
      });
    }

    await order.update({ status });

    // Envoyer une notification WebSocket pour la mise à jour de statut
    if (global.notifySeller) {
      console.log('📡 Envoi notification de mise à jour de statut au vendeur:', req.seller.id);
      global.notifySeller(req.seller.id, 'order_status_update', {
        id: order.id,
        status: order.status,
        customer_name: order.customer_name,
        product_name: order.product?.name || 'Produit',
        total_price: order.total_price,
        updated_at: order.updated_at
      });
    }

    res.json({
      message: 'Statut mis à jour avec succès',
      order: {
        id: order.id,
        product_id: order.product_id,
        seller_id: order.seller_id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        quantity: order.quantity,
        total_price: order.total_price,
        payment_method: order.payment_method,
        payment_proof_url: order.payment_proof_url,
        status: order.status,
        comment: order.comment,
        created_at: order.created_at,
        updated_at: order.updated_at,
        product: order.product ? {
          id: order.product.id,
          name: order.product.name,
          price: order.product.price,
          image_url: order.product.image_url
        } : null
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// Récupérer les détails d'une commande
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { 
        id: orderId, 
        seller_id: req.seller.id 
      },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image_url', 'description']
      }]
    });

    if (!order) {
      return res.status(404).json({
        error: 'Commande non trouvée'
      });
    }

    res.json({
      order: {
        id: order.id,
        product_id: order.product_id,
        seller_id: order.seller_id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        quantity: order.quantity,
        total_price: order.total_price,
        payment_method: order.payment_method,
        payment_proof_url: order.payment_proof_url,
        status: order.status,
        comment: order.comment,
        created_at: order.created_at,
        updated_at: order.updated_at,
        product: order.product ? {
          id: order.product.id,
          name: order.product.name,
          price: order.product.price,
          image_url: order.product.image_url,
          description: order.product.description
        } : null
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// Récupérer les statistiques des commandes
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const sellerId = req.seller.id;

    // Compter les commandes par statut
    const [totalOrders, pendingOrders, paidOrders, deliveredOrders] = await Promise.all([
      Order.count({ where: { seller_id: sellerId } }),
      Order.count({ where: { seller_id: sellerId, status: 'pending' } }),
      Order.count({ where: { seller_id: sellerId, status: 'paid' } }),
      Order.count({ where: { seller_id: sellerId, status: 'delivered' } })
    ]);

    // Calculer le chiffre d'affaires total (toutes commandes)
    const totalRevenueSum = await Order.sum('total_price', {
      where: { seller_id: sellerId }
    });

    const totalRevenue = totalRevenueSum || 0;

    res.json({
      stats: {
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        paid_orders: paidOrders,
        delivered_orders: deliveredOrders,
        total_revenue: parseFloat(totalRevenue.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});



module.exports = router;


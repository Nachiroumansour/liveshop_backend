const jwt = require('jsonwebtoken');
const { Seller } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'liveshop_secret_key';

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token d\'accès requis' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const seller = await Seller.findByPk(decoded.sellerId);

    if (!seller) {
      return res.status(401).json({ 
        error: 'Vendeur non trouvé' 
      });
    }

    req.seller = seller;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expiré' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token invalide' 
      });
    }

    return res.status(500).json({ 
      error: 'Erreur d\'authentification' 
    });
  }
};

const generateToken = (sellerId) => {
  return jwt.sign(
    { sellerId }, 
    JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

module.exports = {
  authenticateToken,
  generateToken
};


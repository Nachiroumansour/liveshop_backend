const express = require('express');
const router = express.Router();
const { OTP } = require('../models');
const twilio = require('twilio');
const { Seller } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP_FROM;

const sendWhatsAppOTP = async (phone, otp) => {
  if (TWILIO_SID && TWILIO_AUTH && TWILIO_WHATSAPP) {
    const client = twilio(TWILIO_SID, TWILIO_AUTH);
    try {
      await client.messages.create({
        from: `whatsapp:${TWILIO_WHATSAPP}`,
        to: `whatsapp:${phone}`,
        body: `Votre code LiveShop Link : ${otp}`
      });
      return true;
    } catch (e) {
      console.error('Erreur Twilio:', e);
      return false;
    }
  } else {
    console.log(`[DEV] OTP pour ${phone} : ${otp}`);
    return true;
  }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, phone_number } = req.body;
  if (!name || !phone_number) return res.status(400).json({ error: 'Nom et numéro requis' });
  // Générer OTP 6 chiffres
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Stocker OTP
  await OTP.create({ phone_number, otp, expires_at: new Date(Date.now() + 5*60*1000), type: 'register', used: false });
  // Debug : log l'OTP créé en base
  const otpEntry = await OTP.findOne({ where: { phone_number, otp, type: 'register', used: false } });
  console.log('OTP créé en base :', otpEntry);
  // Envoyer OTP WhatsApp
  const sent = await sendWhatsAppOTP(phone_number, otp);
  if (!sent) return res.status(500).json({ error: 'Erreur envoi OTP' });
  res.json({ message: 'OTP envoyé' });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone_number, otp } = req.body;
  if (!phone_number || !otp) return res.status(400).json({ error: 'Numéro et OTP requis' });
  // Debug : log la vérification
  console.log('Vérification OTP pour', phone_number, otp);
  const otps = await OTP.findAll({ where: { phone_number, type: 'register', used: false } });
  console.log('OTP valides en base :', otps.map(o => o.otp));
  // Chercher OTP valide
  const otpEntry = await OTP.findOne({
    where: {
      phone_number,
      otp,
      type: 'register',
      used: false,
      expires_at: { [Op.gt]: new Date() }
    }
  });
  if (!otpEntry) return res.status(400).json({ error: 'OTP invalide ou expiré' });
  otpEntry.used = true;
  await otpEntry.save();
  res.json({ message: 'OTP validé' });
});

// POST /api/auth/set-pin
router.post('/set-pin', async (req, res) => {
  const { phone_number, name, pin } = req.body;
  if (!phone_number || !pin) return res.status(400).json({ error: 'Numéro et code PIN requis' });
  if (!/^[0-9]{4}$/.test(pin)) return res.status(400).json({ error: 'Le code PIN doit contenir 4 chiffres' });
  // Vérifier si le compte existe déjà
  let seller = await Seller.findOne({ where: { phone_number } });
  const pin_hash = await bcrypt.hash(pin, 10);
  if (!seller) {
    if (!name) return res.status(400).json({ error: 'Nom requis pour la création du compte' });
    // Générer un public_link_id unique
    const generateId = async () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let id, exists;
      do {
        id = Array.from({length:8},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
        exists = await Seller.findOne({ where: { public_link_id: id } });
      } while (exists);
      return id;
    };
    const public_link_id = await generateId();
    seller = await Seller.create({ phone_number, name, pin_hash, public_link_id });
  } else {
    seller.pin_hash = pin_hash;
    await seller.save();
  }
  res.json({ message: 'Compte créé ou mis à jour', seller: { id: seller.id, name: seller.name, phone_number: seller.phone_number, public_link_id: seller.public_link_id } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phone_number, pin } = req.body;
  if (!phone_number || !pin) return res.status(400).json({ error: 'Numéro et code PIN requis' });
  const seller = await Seller.findOne({ where: { phone_number } });
  if (!seller || !seller.pin_hash) return res.status(401).json({ error: 'Compte ou code PIN incorrect' });
  const valid = await bcrypt.compare(pin, seller.pin_hash);
  if (!valid) return res.status(401).json({ error: 'Compte ou code PIN incorrect' });
  // Générer un token JWT
  const token = jwt.sign({ sellerId: seller.id }, process.env.JWT_SECRET || 'liveshop_secret_key', { expiresIn: '30d' });
    res.json({
      message: 'Connexion réussie',
      token,
      seller: {
        id: seller.id,
        name: seller.name,
        phone_number: seller.phone_number,
      public_link_id: seller.public_link_id
    }
  });
});

// POST /api/auth/forgot-pin
router.post('/forgot-pin', async (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) return res.status(400).json({ error: 'Numéro requis' });
  // Générer OTP 6 chiffres
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Stocker OTP
  await OTP.create({ phone_number, otp, expires_at: new Date(Date.now() + 5*60*1000), type: 'reset', used: false });
  // Envoyer OTP WhatsApp
  const sent = await sendWhatsAppOTP(phone_number, otp);
  if (!sent) return res.status(500).json({ error: 'Erreur envoi OTP' });
  res.json({ message: 'OTP envoyé' });
});

// POST /api/auth/reset-pin
router.post('/reset-pin', async (req, res) => {
  const { phone_number, otp, new_pin } = req.body;
  if (!phone_number || !otp || !new_pin) return res.status(400).json({ error: 'Numéro, OTP et nouveau code requis' });
  if (!/^[0-9]{4}$/.test(new_pin)) return res.status(400).json({ error: 'Le code PIN doit contenir 4 chiffres' });
  // Vérifier OTP
  const otpEntry = await OTP.findOne({
    where: {
      phone_number,
      otp,
      type: 'reset',
      used: false,
      expires_at: { $gt: new Date() }
    }
  });
  if (!otpEntry) return res.status(400).json({ error: 'OTP invalide ou expiré' });
  otpEntry.used = true;
  await otpEntry.save();
  // Mettre à jour le PIN
  const seller = await Seller.findOne({ where: { phone_number } });
  if (!seller) return res.status(404).json({ error: 'Compte introuvable' });
  seller.pin_hash = await bcrypt.hash(new_pin, 10);
  await seller.save();
  res.json({ message: 'Code PIN réinitialisé' });
});

// GET /api/auth/verify
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const seller = req.seller;
    if (!seller) return res.status(404).json({ error: 'Vendeur introuvable' });
    res.json({ seller });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;


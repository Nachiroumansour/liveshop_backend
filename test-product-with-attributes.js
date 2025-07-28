const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';
const SELLER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJZCI6MiwiaWF0IjoxNzUyODAwNDExLCJleHAiOjE3NTUzOTI0MTF9.5BUmVxXUQtWMfzrHOiMPN-6Q-3hfzvzPtT8PWji17n0';

async function testProductWithAttributes() {
  try {
    console.log('🧪 Test de création de produit avec attributs spécifiques...\n');

    // Test 1: Produit de tissu
    console.log('📦 Test 1: Création d\'un produit tissu...');
    const tissuProduct = {
      name: "Tissu Wax Africain Premium",
      description: "Tissu wax de haute qualité, parfait pour les tenues traditionnelles et modernes",
      price: 15000,
      stock_quantity: 50,
      category: "tissus",
      attributes: {
        length: 6,
        width: 120,
        material: "Coton",
        pattern: "Fleuré",
        color: "Bleu et blanc"
      },
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400"
      ],
      tags: ["wax", "africain", "tissu", "traditionnel"],
      weight: 800,
      dimensions: {
        length: 6,
        width: 120,
        height: 0.1
      }
    };

    const tissuResponse = await axios.post(`${API_BASE_URL}/products`, tissuProduct, {
      headers: { Authorization: `Bearer ${SELLER_TOKEN}` }
    });

    console.log('✅ Produit tissu créé:', tissuResponse.data.name);
    console.log('   - Catégorie:', tissuResponse.data.category);
    console.log('   - Attributs:', tissuResponse.data.attributes);
    console.log('   - Images:', tissuResponse.data.images?.length || 0);
    console.log('   - Tags:', tissuResponse.data.tags?.length || 0);
    console.log('');

    // Test 2: Produit vêtement avec variantes
    console.log('👕 Test 2: Création d\'un vêtement avec variantes...');
    const vetementProduct = {
      name: "T-Shirt Premium",
      description: "T-shirt en coton bio, confortable et élégant",
      price: 8500,
      stock_quantity: 100,
      category: "vetements",
      attributes: {
        size: "M",
        color: "Noir",
        material: "Coton bio",
        gender: "Unisexe"
      },
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"
      ],
      tags: ["t-shirt", "coton", "bio", "unisexe"],
      has_variants: true,
      variants: [
        {
          name: "Noir - S",
          attributes: { size: "S", color: "Noir" },
          stock_quantity: 25,
          price: 8500
        },
        {
          name: "Noir - M",
          attributes: { size: "M", color: "Noir" },
          stock_quantity: 30,
          price: 8500
        },
        {
          name: "Noir - L",
          attributes: { size: "L", color: "Noir" },
          stock_quantity: 25,
          price: 8500
        },
        {
          name: "Blanc - S",
          attributes: { size: "S", color: "Blanc" },
          stock_quantity: 20,
          price: 8500
        }
      ],
      weight: 200,
      dimensions: {
        length: 70,
        width: 50,
        height: 2
      }
    };

    const vetementResponse = await axios.post(`${API_BASE_URL}/products`, vetementProduct, {
      headers: { Authorization: `Bearer ${SELLER_TOKEN}` }
    });

    console.log('✅ Produit vêtement créé:', vetementResponse.data.name);
    console.log('   - Catégorie:', vetementResponse.data.category);
    console.log('   - Attributs:', vetementResponse.data.attributes);
    console.log('   - Variantes:', vetementResponse.data.variants?.length || 0);
    console.log('   - Images:', vetementResponse.data.images?.length || 0);
    console.log('');

    // Test 3: Produit bijoux
    console.log('💍 Test 3: Création d\'un bijou...');
    const bijouProduct = {
      name: "Bague en Argent 925",
      description: "Bague élégante en argent massif, design traditionnel africain",
      price: 45000,
      stock_quantity: 15,
      category: "bijoux",
      attributes: {
        material: "Argent",
        weight: 8.5,
        size: "18",
        type: "Bague"
      },
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"
      ],
      tags: ["bague", "argent", "traditionnel", "africain"],
      weight: 8.5,
      dimensions: {
        length: 2,
        width: 2,
        height: 1
      }
    };

    const bijouResponse = await axios.post(`${API_BASE_URL}/products`, bijouProduct, {
      headers: { Authorization: `Bearer ${SELLER_TOKEN}` }
    });

    console.log('✅ Produit bijou créé:', bijouResponse.data.name);
    console.log('   - Catégorie:', bijouResponse.data.category);
    console.log('   - Attributs:', bijouResponse.data.attributes);
    console.log('   - Poids:', bijouResponse.data.weight, 'g');
    console.log('');

    // Test 4: Produit alimentaire
    console.log('🍯 Test 4: Création d\'un produit alimentaire...');
    const alimentProduct = {
      name: "Miel de Baobab Bio",
      description: "Miel pur de baobab, récolté dans les forêts du Sénégal",
      price: 3500,
      stock_quantity: 30,
      category: "alimentation",
      attributes: {
        weight: 0.5,
        expiry_date: "2025-12-31",
        origin: "Sénégal",
        storage: "Ambiance"
      },
      images: [
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400"
      ],
      tags: ["miel", "bio", "baobab", "naturel"],
      weight: 500,
      dimensions: {
        length: 8,
        width: 8,
        height: 12
      }
    };

    const alimentResponse = await axios.post(`${API_BASE_URL}/products`, alimentProduct, {
      headers: { Authorization: `Bearer ${SELLER_TOKEN}` }
    });

    console.log('✅ Produit alimentaire créé:', alimentResponse.data.name);
    console.log('   - Catégorie:', alimentResponse.data.category);
    console.log('   - Attributs:', alimentResponse.data.attributes);
    console.log('   - Date d\'expiration:', alimentResponse.data.attributes?.expiry_date);
    console.log('');

    // Test 5: Service
    console.log('💇‍♀️ Test 5: Création d\'un service...');
    const serviceProduct = {
      name: "Coiffure Africaine Traditionnelle",
      description: "Service de coiffure traditionnelle africaine, tresses et nattes",
      price: 15000,
      stock_quantity: 999, // Services illimités
      category: "services",
      attributes: {
        duration: "2-3 heures",
        location: "À domicile",
        type: "Coiffure"
      },
      images: [
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400"
      ],
      tags: ["coiffure", "africaine", "tresses", "nattes", "domicile"],
      weight: null,
      dimensions: null
    };

    const serviceResponse = await axios.post(`${API_BASE_URL}/products`, serviceProduct, {
      headers: { Authorization: `Bearer ${SELLER_TOKEN}` }
    });

    console.log('✅ Service créé:', serviceResponse.data.name);
    console.log('   - Catégorie:', serviceResponse.data.category);
    console.log('   - Attributs:', serviceResponse.data.attributes);
    console.log('   - Durée:', serviceResponse.data.attributes?.duration);
    console.log('');

    // Récupérer tous les produits pour vérifier
    console.log('📋 Récupération de tous les produits...');
    const allProductsResponse = await axios.get(`${API_BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${SELLER_TOKEN}` }
    });

    console.log(`✅ ${allProductsResponse.data.length} produits récupérés`);
    
    // Afficher un résumé par catégorie
    const categories = {};
    allProductsResponse.data.forEach(product => {
      const category = product.category || 'general';
      categories[category] = (categories[category] || 0) + 1;
    });

    console.log('\n📊 Résumé par catégorie:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} produits`);
    });

    console.log('\n🎉 Tests terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
  }
}

// Exécuter les tests
testProductWithAttributes(); 
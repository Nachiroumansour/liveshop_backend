const PDFDocument = require('pdfkit');

console.log('🧪 Test simple de génération PDF');
console.log('================================');

try {
  console.log('📄 Création du document PDF...');
  
  // Créer un PDF simple
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  // Écrire dans un fichier pour tester
  const fs = require('fs');
  const writeStream = fs.createWriteStream('test-ticket.pdf');
  doc.pipe(writeStream);

  // Contenu simple
  doc.fontSize(24)
     .text('TICKET DE LIVRAISON', { align: 'center' });
  
  doc.moveDown(1);
  doc.fontSize(16)
     .text('Commande #29', { align: 'center' });
  
  doc.moveDown(1);
  doc.fontSize(12)
     .text('Test de génération PDF');

  console.log('📝 Ajout du contenu...');
  
  // Finaliser
  doc.end();
  
  writeStream.on('finish', () => {
    console.log('✅ PDF généré avec succès: test-ticket.pdf');
  });

} catch (error) {
  console.error('❌ Erreur:', error);
} 
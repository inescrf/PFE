const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route principale
app.get('/', (req, res) => res.send('Backend is running!'));

// Route pour traiter les fichiers PDF
app.post('/upload/pdf', upload.single('file'), async (req, res) => {
  try {
    console.log('Requête reçue :', req.body); // Vérifie les données reçues
    console.log('Fichier uploadé :', req.file); // Vérifie si Multer a bien traité le fichier

    if (!req.file) {
      console.error('Aucun fichier reçu.');
      return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    // Vérifie si c'est un fichier PDF
    if (fileExtension !== '.pdf') {
      console.error('Type de fichier non supporté.');
      return res.status(400).json({
        message: 'Le type de fichier ne correspond pas au format attendu : veuillez soumettre un fichier PDF.',
      });
    }

    console.log(`Fichier reçu : ${filePath}`);

    // Lire le contenu du fichier PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Génère un fichier texte
    const textFileName = `${path.basename(req.file.originalname, '.pdf')}.txt`;
    const textFilePath = path.join('uploads', textFileName);

    console.log(`Création du fichier texte : ${textFilePath}`);
    fs.writeFileSync(textFilePath, pdfData.text);

    console.log('Texte extrait avec succès.');

    // Retourne le lien pour télécharger le fichier texte
    res.status(200).json({
      message: 'Texte extrait avec succès.',
      downloadLink: `http://localhost:${PORT}/uploads/${textFileName}`,
    });
  } catch (error) {
    console.error('Erreur lors du traitement :', error.message);
    res.status(500).json({ message: 'Erreur lors de l\'analyse du fichier PDF.' });
  }
});


// Rendre les fichiers téléchargeables
app.use('/uploads', express.static('uploads'));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

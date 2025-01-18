const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const Tesseract = require('tesseract.js');

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

// Fonction générique pour créer et retourner un fichier texte
const createTextFile = (originalName, content) => {
  const textFileName = `${path.basename(originalName, path.extname(originalName))}.txt`;
  const textFilePath = path.join('uploads', textFileName);
  fs.writeFileSync(textFilePath, content);
  return textFilePath; // Retourne le chemin complet du fichier
};

// Route pour traiter les fichiers PDF et images
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.bmp'];

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        message: 'Le type de fichier ne correspond pas au format attendu : veuillez soumettre un fichier PDF ou une image.',
      });
    }

    let extractedText;

    if (fileExtension === '.pdf') {
      // Extraction du texte d'un fichier PDF
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else {
      // Extraction du texte d'une image
      const { data } = await Tesseract.recognize(filePath, 'eng');
      extractedText = data.text;
    }

    // Génération du fichier texte
    const textFilePath = createTextFile(req.file.originalname, extractedText);

    // Envoie le fichier directement au téléchargement
    res.download(textFilePath, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi du fichier :', err);
        res.status(500).json({ message: 'Erreur lors de l\'envoi du fichier.' });
      }
    });
  } catch (error) {
    console.error('Erreur lors du traitement :', error.message);
    res.status(500).json({ message: 'Erreur lors de l\'analyse du fichier.' });
  }
});

// Rendre les fichiers téléchargeables
app.use('/uploads', express.static('uploads'));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

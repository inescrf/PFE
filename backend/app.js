const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Déclaration unique de CORS

const app = express();
const PORT = 5001;

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom du fichier avec timestamp
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors({ origin: '*' })); // Autorise toutes les origines
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route principale
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Route pour le téléchargement de fichiers
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('Requête reçue avec le fichier :', req.file); // Log pour vérifier
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
  }
  res.status(200).json({
    message: 'Fichier téléchargé avec succès !',
    file: req.file,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

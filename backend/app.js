const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const { spawn } = require('child_process');

const app = express();
const PORT = 5001;

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Backend is running!'));

// Fonction pour exécuter le script Python avec le bon chemin
const runPythonAnalysis = (textFilePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'analyze.py'); // Chemin absolu du script Python

    console.log(`Exécution du script Python : ${scriptPath}`);

    const pythonProcess = spawn('/Users/ines/.pyenv/versions/3.10.12/bin/python3', [scriptPath, textFilePath]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Erreur Python : ${data}`);
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log("Sortie brute du script Python :", result);  // ✅ Ajout du log
      if (code === 0) {
        try {
          resolve(JSON.parse(result));
        } catch (error) {
          reject(`Erreur lors du parsing du JSON : ${result}`);
        }
      } else {
        reject(`Processus terminé avec le code ${code}`);
      }
    });
  });
};

// Route de traitement des fichiers
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.bmp'];

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ message: 'Type de fichier non supporté.' });
    }

    let extractedText;

    if (fileExtension === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else {
      const { data } = await Tesseract.recognize(filePath, 'eng');
      extractedText = data.text;
    }

    const textFilePath = path.join(__dirname, 'uploads', `${Date.now()}.txt`);
    fs.writeFileSync(textFilePath, extractedText);

    console.log(`Fichier texte généré : ${textFilePath}`);

    const analysisResult = await runPythonAnalysis(textFilePath);
    
    res.json({ message: 'Analyse réussie', analysis: analysisResult });

  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ message: 'Erreur interne.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

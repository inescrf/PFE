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

// ✅ Configuration CORS - Autoriser uniquement le frontend
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configuration de Multer pour gérer les uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Route de test
app.get('/', (req, res) => res.send('Backend is running!'));

// ✅ Fonction pour exécuter le script Python et analyser le texte
const runPythonAnalysis = (textFilePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'analyze.py');
    const pythonExecutable = "/Users/ines/.pyenv/versions/3.10.12/bin/python3";

    console.log(`🔍 Exécution de ${scriptPath} avec ${textFilePath}...`);

    const pythonProcess = spawn(pythonExecutable, [scriptPath, textFilePath], { shell: true });

    let result = '';
    pythonProcess.stdout.setEncoding('utf8');
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`❌ Erreur Python : ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        let cleanedResult = result.trim();

        // ✅ Supprimer tout le texte avant la première accolade ouvrante '{'
        const jsonStartIndex = cleanedResult.indexOf('{');
        if (jsonStartIndex !== -1) {
          cleanedResult = cleanedResult.substring(jsonStartIndex);
        }

        try {
          const parsedResult = JSON.parse(cleanedResult);
          
          // ✅ Vérification de la structure JSON
          if (!parsedResult.type_contrat || !Array.isArray(parsedResult.vices)) {
            resolve({ type_contrat: "Inconnu", vices: [] });
          } else {
            resolve(parsedResult);
          }
        } catch (error) {
          reject(`❌ Erreur parsing JSON : ${error}\nSortie brute : ${result}`);
        }
      } else {
        reject(`❌ Processus Python terminé avec code ${code}`);
      }
    });
  });
};

// ✅ Suppression du fichier existant avant d'écrire un nouveau
const deleteExistingFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Fichier existant supprimé : ${filePath}`);
  }
};

// ✅ Route d'upload et d'analyse
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log("📩 Requête reçue sur /upload !");
  console.log("📂 Fichier reçu :", req.file ? req.file.originalname : "Aucun fichier");

  try {
    if (!req.file) {
      console.warn("⚠️ Aucun fichier téléchargé.");
      return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.bmp'];

    console.log(`📂 Fichier reçu : ${req.file.originalname} (${fileExtension})`);

    if (!allowedExtensions.includes(fileExtension)) {
      console.warn("⚠️ Type de fichier non supporté.");
      return res.status(400).json({ message: 'Type de fichier non supporté.' });
    }

    let extractedText = '';

    if (fileExtension === '.pdf') {
      console.log("📄 Extraction du texte depuis un PDF...");
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else {
      console.log("🖼️ Extraction du texte depuis une image...");
      const { data } = await Tesseract.recognize(filePath, 'eng');
      extractedText = data.text;
    }

    const textFilePath = path.join(__dirname, 'uploads', 'cv2.txt');
    deleteExistingFile(textFilePath);  // Suppression de l'ancien fichier

    fs.writeFileSync(textFilePath, extractedText, { encoding: 'utf8' });

    console.log(`📄 Fichier texte généré : ${textFilePath}`);

    // ✅ Exécuter l'analyse Python
    const analysisResult = await runPythonAnalysis(textFilePath);
    
    console.log("📊 Résultat de l'analyse envoyé au frontend :", analysisResult);

    res.json({ message: 'Analyse réussie', analysis: analysisResult });

  } catch (error) {
    console.error('❌ Erreur serveur :', error);
    res.status(500).json({ message: 'Erreur interne.', error: error.toString() });
  }
});

// ✅ Middleware global pour gérer les erreurs (optionnel mais conseillé)
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// ✅ Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

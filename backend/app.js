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
    const scriptPath = path.join(__dirname, 'analyze.py');
    const pythonExecutable = "/Users/ines/.pyenv/versions/3.10.12/bin/python3";

    const pythonProcess = spawn(pythonExecutable, [scriptPath, textFilePath], { shell: true });

    let result = '';
    pythonProcess.stdout.setEncoding('utf8');
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Erreur Python : ${data}`);
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
          resolve(parsedResult);
        } catch (error) {
          reject(`Erreur lors du parsing JSON : ${error}\nSortie brute : ${result}`);
        }


        try {
          const parsedResult = JSON.parse(cleanedResult);
        
          // Vérifier que la structure est correcte
          if (!parsedResult.type_contrat || !Array.isArray(parsedResult.vices)) {
            resolve({ type_contrat: "Inconnu", vices: [] });
          } else {
            resolve(parsedResult);
          }
        } catch (error) {
          reject(`Erreur lors du parsing JSON : ${error}\nSortie brute : ${result}`);
        }
        
      } else {
        reject(`Processus terminé avec le code ${code}`);
      }
    });
  });
};


// Suppression du fichier cgv.txt s'il existe déjà
const deleteExistingFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Fichier existant supprimé : ${filePath}`);
  }
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

    const textFilePath = path.join(__dirname, 'uploads', 'cv2.txt');
    deleteExistingFile(textFilePath);  // Suppression de l'ancien fichier cgv.txt

    fs.writeFileSync(textFilePath, extractedText, { encoding: 'utf8' });

    console.log(`Fichier texte généré : ${textFilePath}`);

    console.log(`Fichier texte généré : ${textFilePath}`);

    const analysisResult = await runPythonAnalysis(textFilePath);
    
    console.log("Résultat de l'analyse envoyé au frontend :", analysisResult);

    res.json({ message: 'Analyse réussie', analysis: analysisResult });

  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ message: 'Erreur interne.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

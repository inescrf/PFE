import { useState } from 'react';
import { FiDownload, FiFileText, FiImage, FiFile } from 'react-icons/fi';
import { AiFillFilePdf } from 'react-icons/ai';

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const getFileIcon = () => {
    if (!file) return null;
    const fileType = file.type;
    if (fileType.includes('pdf')) return <AiFillFilePdf className="text-red-600 h-6 w-6" />;
    if (fileType.includes('image')) return <FiImage className="text-blue-600 h-6 w-6" />;
    if (fileType.includes('text')) return <FiFileText className="text-green-600 h-6 w-6" />;
    return <FiFile className="text-gray-600 h-6 w-6" />;
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAnalysisResult(null);
    setIsLoading(true);

    if (!file) {
      setMessage('Veuillez sélectionner un fichier.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Analyse réussie ! Voici les résultats :');
        setAnalysisResult(data.analysis);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Erreur lors du traitement du fichier.');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      setMessage('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      <main className="container mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Téléchargez votre fichier</h1>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-blue-900 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v13a2 2 0 002 2h14a2 2 0 002-2V7M16 3l-4-4m0 0L8 3m4-4v8" />
          </svg>
          <p className="text-lg font-medium text-gray-700 mb-2">Votre fichier</p>
          <p className="text-sm text-gray-500 mb-4">Télécharger ou glisser le fichier ici</p>

          {file ? (
            <div className="flex items-center space-x-2 mt-2">
              {getFileIcon()}
              <p className="text-sm text-gray-800">{file.name}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Aucun fichier sélectionné</p>
          )}

          <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Choisir un fichier
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center justify-center mx-auto"
          disabled={isLoading}
        >
          <FiDownload className="mr-2" /> {isLoading ? 'Traitement...' : 'Soumettre'}
        </button>

        {message && <p className="mt-4 text-center text-green-500">{message}</p>}

        {analysisResult && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Résultats de l'analyse</h2>
            <p><strong>Type de contrat :</strong> {analysisResult.type_contrat}</p>
            <h3 className="text-lg font-semibold text-gray-600 mt-4">Clauses détectés :</h3>
            {analysisResult && Array.isArray(analysisResult.vices) && analysisResult.vices.length > 0 ? (
            <ul className="list-disc pl-5">
              {analysisResult.vices.map((vice, index) => (
              <li key={index} className="mb-2">
                <strong className="text-blue-900">{vice[0]}</strong>: {vice[1]}  
                  <br /><span className="text-sm text-gray-600"> {vice[2]}</span>
                  <br /><span className="text-sm text-gray-600"> {vice[3]}</span>
              </li>
              ))}
            </ul>
) : (
  <p className="text-gray-500">Aucun vice détecté ou les données sont manquantes.</p>
)}

          </div>
        )}
      </main>
      
    </div>
  );
}

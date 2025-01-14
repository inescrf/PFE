import { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { FiDownload, FiFileText, FiImage, FiFile } from 'react-icons/fi';
import { AiFillFilePdf } from 'react-icons/ai'; // Icône pour PDF

export default function Home() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour déterminer l'icône en fonction du type de fichier
    const getFileIcon = () => {
        if (!file) return null;

        const fileType = file.type;
        if (fileType.includes('pdf')) return <AiFillFilePdf className="text-red-600 h-6 w-6" />;
        if (fileType.includes('image')) return <FiImage className="text-blue-600 h-6 w-6" />;
        if (fileType.includes('text')) return <FiFileText className="text-green-600 h-6 w-6" />;
        return <FiFile className="text-gray-600 h-6 w-6" />;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
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
                setMessage(data.message);
                setFile(null); // Réinitialise le fichier après succès

                // Effacer le message après 3 secondes
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Erreur lors du téléchargement.');
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
            <Header />
            <main className="container mx-auto mt-10 p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Téléchargez votre fichier</h1>
                
                {/* Zone de drag and drop */}
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
                    <p className="text-lg font-medium text-gray-700 mb-2">Votre dossier</p>
                    <p className="text-sm text-gray-500 mb-4">Télécharger ou glisser le fichier</p>
                    
                    {/* Affichage du nom et icône du fichier */}
                    {file ? (
                        <div className="flex items-center space-x-2 mt-2">
                            {getFileIcon()}
                            <p className="text-sm text-gray-800">{file.name}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mt-2">Aucun fichier sélectionné</p>
                    )}
                    
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        id="file-upload"
                    />
                    <label 
                        htmlFor="file-upload" 
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                    >
                        Choisir un fichier
                    </label>
                </div>

                {/* Bouton d'envoi */}
                <button 
                    onClick={handleSubmit} 
                    className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center justify-center mx-auto"
                    disabled={isLoading}
                >
                    <FiDownload className="mr-2" /> Télécharger
                </button>

                {/* Loader */}
                {isLoading && (
                    <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900"></div>
                    </div>
                )}

                {/* Message */}
                {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
            </main>
            <Footer />
        </div>
    );
}

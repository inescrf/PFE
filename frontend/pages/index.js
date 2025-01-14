import { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function Home() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // État pour le loader

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true); // Démarre le loader

        if (!file) {
            setMessage('Veuillez sélectionner un fichier.');
            setIsLoading(false); // Arrête le loader
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
                setMessage(data.message); // Affiche le message de succès
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Erreur lors du téléchargement.');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
            setMessage('Erreur réseau. Veuillez réessayer.');
        } finally {
            setIsLoading(false); // Arrête le loader une fois le téléchargement terminé
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <Header />
            <main className="container mx-auto mt-10 p-4">
                <h1 className="text-3xl font-bold mb-6">Bienvenue sur le site</h1>
                <form onSubmit={handleSubmit} className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Déposez un fichier
                    </label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="mb-4 border border-gray-300 p-2 w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Envoyer
                    </button>
                </form>

                {/* Loader */}
                {isLoading && (
                    <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900 border-opacity-80"></div>
                    </div>
                )}

                {message && <p className="mt-4 text-green-500">{message}</p>}
            </main>
            <Footer />
        </div>
    );
}

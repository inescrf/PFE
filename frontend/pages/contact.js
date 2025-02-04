import { useState } from "react";
import emailjs from "@emailjs/browser";


export default function Contact() {
    const [formData, setFormData] = useState({
        email: "",
        contractType: "CGV",
        message: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false); // Ajout d'un état pour le "Envoi en cours"

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const templateParams = {
            user_email: formData.email,
            contract_type: formData.contractType,
            user_message: formData.message,
        };

        setLoading(true); // Activer "Envoi en cours"

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                templateParams,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY // 🔥 Ici on met la clé publique
            );
            

            setSuccessMessage("Votre demande a bien été transmise ! Vous recevrez une confirmation par email.");
            setFormData({ email: "", contractType: "CGV", message: "" });
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire", error);
            setSuccessMessage("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false); // Désactiver "Envoi en cours"

            // Supprimer le message de succès après 3 secondes
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            
            <main className="container mx-auto mt-10 p-4 text-center">
                <h1 className="text-3xl font-bold mb-6 text-black">Nous Contacter</h1>
                <p className="text-gray-700 mb-6">Une question ? Un problème ? Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>

                <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
                    {/* Champ Email */}
                    <div className="mb-4 text-left">
                        <label className="block text-gray-800 font-medium mb-2">Adresse Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg"
                            placeholder="Votre adresse email"
                        />
                    </div>

                    {/* Sélection Type de Contrat */}
                    <div className="mb-4 text-left">
                        <label className="block text-gray-800 font-medium mb-2">Type de contrat</label>
                        <select
                            name="contractType"
                            value={formData.contractType}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="CGV">CGV et mentions légales</option>
                            <option value="Contrat Travail">Contrat de travail</option>
                            <option value="Partenariat">Contrat de partenariat</option>
                            <option value="NDA">Accord de confidentialité (NDA)</option>
                        </select>
                    </div>

                    {/* Message du Problème */}
                    <div className="mb-4 text-left">
                        <label className="block text-gray-800 font-medium mb-2">Votre question ou problème</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg h-32"
                            placeholder="Décrivez votre problème ici..."
                        />
                    </div>

                    {/* Bouton Envoyer */}
                    <button
                        type="submit"
                        className={`w-full p-3 rounded-lg font-semibold transition ${
                            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-800"
                        }`}
                        disabled={loading} // Désactiver le bouton pendant l'envoi
                    >
                        {loading ? "Envoi en cours..." : "Envoyer"} {/* Texte dynamique */}
                    </button>
                </form>

                {/* Message de confirmation */}
                {successMessage && <p className="mt-4 text-green-600 font-medium">{successMessage}</p>}
            </main>
            
        </div>
    );
}

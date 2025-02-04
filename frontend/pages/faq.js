
import { FaBalanceScale, FaFileAlt, FaShieldAlt, FaGavel, FaSyncAlt, FaUserTie } from "react-icons/fa";

export default function FAQ() {
    return (
        <div className="min-h-screen flex flex-col">
            
            <main className="container mx-auto mt-10 p-4 text-center">
                {/* Titre */}
                <h1 className="text-3xl font-bold mb-10 text-center text-black">Foire aux Questions</h1>

                {/* Section FAQ */}
                <div className="max-w-3xl mx-auto space-y-8 text-left">
                    
                    {/* Question 1 */}
                    <div className="p-6 border rounded-lg shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-900 text-white rounded-full">
                                <FaBalanceScale size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">Qu’est-ce qu’un vice de forme et un vice de fond ?</h2>
                        </div>
                        <p className="text-gray-700 mt-2">
                            <strong>Vice de forme :</strong> Erreurs liées à la structure du document (mentions obligatoires manquantes, absence de signatures). 
                            <br />Exemple : des CGV sans mentions légales peuvent être considérées comme nulles.
                        </p>
                        <p className="text-gray-700 mt-2">
                            <strong>Vice de fond :</strong> Problèmes liés au contenu du document (clauses abusives, contradictions juridiques). 
                            <br />Exemple : une clause de résiliation trop stricte peut être invalidée par un tribunal.
                        </p>
                    </div>

                    {/* Question 2 */}
                    <div className="p-6 border rounded-lg shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-900 text-white rounded-full">
                                <FaGavel size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">Comment fonctionne l’analyse des documents avec ViceDetect ?</h2>
                        </div>
                        <p className="text-gray-700 mt-2">
                            L’utilisateur télécharge son document sur notre plateforme. Notre IA l’analyse en quelques secondes, identifiant 
                            les vices de forme et de fond selon les réglementations en vigueur. Un rapport détaillé est ensuite fourni.
                        </p>
                    </div>

                    {/* Question 3 */}
                    <div className="p-6 border rounded-lg shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-900 text-white rounded-full">
                                <FaFileAlt size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">Quels types de documents peuvent être analysés ?</h2>
                        </div>
                        <p className="text-gray-700 mt-2">ViceDetect prend en charge divers documents juridiques :</p>
                        <ul className="list-disc list-inside text-gray-700 mt-2">
                            <li>CGV et mentions légales</li>
                            <li>Contrats commerciaux (prestations de service, partenariats, travail)</li>
                            <li>Statuts d’entreprise et pactes d’associés</li>
                            <li>Accords de confidentialité (NDA)</li>
                        </ul>
                    </div>

                    {/* Question 4 */}
                    <div className="p-6 border rounded-lg shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-900 text-white rounded-full">
                                <FaShieldAlt size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">L’outil est-il conforme au RGPD ?</h2>
                        </div>
                        <p className="text-gray-700 mt-2">
                            Oui, nous garantissons la protection et la confidentialité des documents analysés. Aucune donnée n’est conservée après analyse, 
                            et les échanges sont sécurisés selon les normes RGPD et les meilleures pratiques en cybersécurité.
                        </p>
                    </div>

                    {/* Question 5 */}
                    <div className="p-6 border rounded-lg shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-900 text-white rounded-full">
                                <FaSyncAlt size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">L’IA est-elle mise à jour en fonction des évolutions légales ?</h2>
                        </div>
                        <p className="text-gray-700 mt-2">
                            Oui, nous effectuons une veille juridique continue pour intégrer les évolutions législatives et garantir des analyses conformes 
                            aux dernières réglementations. Notre IA s’améliore aussi grâce aux retours utilisateurs et à l’apprentissage automatique.
                        </p>
                    </div>

                    {/* Question 6 */}
                    <div className="p-6 border rounded-lg shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-900 text-white rounded-full">
                                <FaUserTie size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">Est-ce que ViceDetect remplace un avocat ?</h2>
                        </div>
                        <p className="text-gray-700 mt-2">
                            Non, ViceDetect est un outil d’assistance. Il offre une pré-analyse rapide et économique pour identifier les erreurs courantes, 
                            mais un avocat reste indispensable pour des conseils juridiques approfondis.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}

import Header from '../components/header';

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto mt-10 p-4 text-center">
                {/* Titre */}
                <h1 className="text-3xl font-bold mb-10 text-center text-black">Qui sommes-nous ? </h1>

                {/* Section photos */}
                <div className="grid grid-cols-3 gap-x-23 gap-y-6 mb-10 justify-center">
                    {/* Première ligne */}
                    <div className="flex flex-col items-center">
                        <img 
                            src="/anujin.png" 
                            alt="Anujin" 
                            className="w-32 h-32 rounded-full object-cover mb-2 border border-black" 
                        />
                        <p className="text-lg font-medium">Anujin</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img 
                            src="/chirine.png" 
                            alt="Chirine" 
                            className="w-32 h-32 rounded-full object-cover mb-2 border border-black" 
                        />
                        <p className="text-lg font-medium">Chirine</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img 
                            src="/clement.png" 
                            alt="Clément" 
                            className="w-32 h-32 rounded-full object-cover mb-2 border border-black" 
                        />
                        <p className="text-lg font-medium">Clément</p>
                    </div>

                    {/* Deuxième ligne */}
                    <div className="flex flex-col items-center">
                        <img 
                            src="/dorine.png" 
                            alt="Dorine" 
                            className="w-32 h-32 rounded-full object-cover mb-2 border border-black" 
                        />
                        <p className="text-lg font-medium">Dorine</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img 
                            src="/ines.png" 
                            alt="Inès" 
                            className="w-32 h-32 rounded-full object-cover mb-2 border border-black" 
                        />
                        <p className="text-lg font-medium">Inès</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img 
                            src="/marie.png" 
                            alt="Marie" 
                            className="w-32 h-32 rounded-full object-cover mb-2 border border-black" 
                        />
                        <p className="text-lg font-medium">Marie</p>
                    </div>
                </div>

                {/* Texte explicatif */}
                <p className="text-gray-700 text-base leading-relaxed">
                    Nous sommes 6 étudiants en dernière année d'école d'ingénieur, spécialisés en développement logiciel et data science.
                    Ce projet, intitulé <strong>ViceDetect</strong>, a été réalisé dans le cadre de notre Projet de Fin d'Études.
                    Notre objectif était de créer un outil intelligent capable d'analyser rapidement des dossiers juridiques pour
                    détecter les vices de procédure et faciliter le travail des avocats.
                    Nous espérons que cet outil contribuera à améliorer l'efficacité des systèmes judiciaires.
                </p>
            </main>
        </div>
    );
}

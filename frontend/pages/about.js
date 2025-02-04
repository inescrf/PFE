import Image from 'next/image';

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            
            <main className="container mx-auto mt-10 p-4 text-center">
                {/* Titre */}
                <h1 className="text-3xl font-bold mb-10 text-center text-black">Qui sommes-nous ?</h1>

                {/* Section photos */}
                <div className="grid grid-cols-3 gap-x-8 gap-y-6 mb-10 justify-center">
                    {/* Première ligne */}
                    <div className="flex flex-col items-center">
                        <div className="w-32 aspect-square rounded-full overflow-hidden border border-black">
                            <Image 
                                src="/anujin.png" 
                                alt="Anujin" 
                                width={128} 
                                height={128} 
                                className="object-contain" 
                            />
                        </div>
                        <p className="text-lg font-medium">Anujin</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-32 aspect-square rounded-full overflow-hidden border border-black">
                            <Image 
                                src="/chirine.png" 
                                alt="Chirine" 
                                width={128} 
                                height={128} 
                                className="object-contain" 
                            />
                        </div>
                        <p className="text-lg font-medium">Chirine</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-32 aspect-square rounded-full overflow-hidden border border-black">
                            <Image 
                                src="/clement.png" 
                                alt="Clément" 
                                width={128} 
                                height={128} 
                                className="object-contain" 
                            />
                        </div>
                        <p className="text-lg font-medium">Clément</p>
                    </div>

                    {/* Deuxième ligne */}
                    <div className="flex flex-col items-center">
                        <div className="w-32 aspect-square rounded-full overflow-hidden border border-black">
                            <Image 
                                src="/dorine.png" 
                                alt="Dorine" 
                                width={128} 
                                height={128} 
                                className="object-contain" 
                            />
                        </div>
                        <p className="text-lg font-medium">Dorine</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-32 aspect-square rounded-full overflow-hidden border border-black">
                            <Image 
                                src="/ines.png" 
                                alt="Inès" 
                                width={128} 
                                height={128} 
                                className="object-contain" 
                            />
                        </div>
                        <p className="text-lg font-medium">Inès</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-32 aspect-square rounded-full overflow-hidden border border-black">
                            <Image 
                                src="/marie.png" 
                                alt="Marie" 
                                width={128} 
                                height={128} 
                                className="object-contain" 
                            />
                        </div>
                        <p className="text-lg font-medium">Marie</p>
                    </div>
                </div>

                {/* Texte explicatif */}
                <p className="text-gray-700 text-base leading-relaxed">
                    Nous sommes 6 étudiants en dernière année d&#39;école d&#39;ingénieur, spécialisés en développement logiciel et data science.
                    Ce projet, intitulé <strong>ViceDetect</strong>, a été réalisé dans le cadre de notre Projet de Fin d&#39;Études.
                    Notre objectif était de créer un outil intelligent capable d&#39;analyser rapidement des dossiers juridiques pour
                    détecter les vices de procédure et faciliter le travail des avocats.
                    Nous espérons que cet outil contribuera à améliorer l&#39;efficacité des systèmes judiciaires.
                </p>
            </main>
        </div>
    );
}

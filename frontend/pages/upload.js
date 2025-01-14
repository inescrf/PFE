import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Upload() {
    const router = useRouter();

    useEffect(() => {
        // Redirige vers la page d'accueil
        router.push('/');
    }, [router]);

    return null; // Aucun contenu affiché
}

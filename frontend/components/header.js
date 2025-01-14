import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-blue-900 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Nom du site */}
                <div className="text-2xl font-bold">
                    <Link href="/">ViceDetect</Link>
                </div>

                {/* Navigation */}
                <nav className="flex space-x-6">
                    <Link href="/upload" className="hover:text-gray-300">Upload</Link>
                    <Link href="/about" className="hover:text-gray-300">Qui sommes-nous ? </Link>
                    <Link href="/faq" className="hover:text-gray-300">FAQ</Link>
                    <Link href="/contact" className="hover:text-gray-300">Nous contacter</Link>
                </nav>
            </div>
        </header>
    );
}

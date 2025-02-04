import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="bg-blue-900 text-white shadow-md">
            <div className="w-full px-4 flex justify-between items-center p-4">
                {/* Logo + Nom du site */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logo.png" alt="ViceDetect Logo" width={40} height={40} />
                    <span className="text-2xl font-bold">ViceDetect</span>
                </Link>

                {/* Navigation */}
                <nav className="flex space-x-6">
                    <Link href="/upload" className="hover:text-gray-300">Upload</Link>
                    <Link href="/about" className="hover:text-gray-300">Qui sommes-nous ?</Link>
                    <Link href="/faq" className="hover:text-gray-300">FAQ</Link>
                    <Link href="/contact" className="hover:text-gray-300">Nous contacter</Link>
                </nav>
            </div>
        </header>
    );
}

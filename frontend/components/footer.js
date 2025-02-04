import { FaEnvelope } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-200 text-gray-700 text-center p-6 border-t">
            <div className="w-full px-4 flex flex-col md:flex-row justify-between items-center">
                
                {/* Copyright */}
                <p className="mb-2 md:mb-0">© 2025 ViceDetect. Tous droits réservés.</p>

                {/* Adresse email */}
                <div className="flex items-center space-x-2">
                    <FaEnvelope />
                    <a href="mailto:vicedetect@gmail.com" className="hover:underline">vicedetect@gmail.com</a>
                </div>

                {/* Liens utiles */}
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
                    <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
                    <Link href="/cgu" className="hover:underline">CGU</Link>
                </div>
            </div>
        </footer>
    );
}

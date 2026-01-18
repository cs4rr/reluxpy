import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-leather-900 text-leather-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="font-serif text-2xl font-bold text-gold-400">RELUX</span>
            <p className="mt-4 text-sm leading-relaxed">
              Artículos de cuero de alta calidad, diseñados con pasión y 
              elaborados con los mejores materiales para quienes aprecian 
              la elegancia atemporal.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">
              Enlaces
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-gold-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-sm hover:text-gold-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm hover:text-gold-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} className="text-gold-400" />
                <span>+595 971 123 456</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} className="text-gold-400" />
                <span>info@relux.com.py</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="p-2 bg-leather-800 rounded-full hover:bg-gold-500 hover:text-leather-900 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 bg-leather-800 rounded-full hover:bg-gold-500 hover:text-leather-900 transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-leather-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Relux. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

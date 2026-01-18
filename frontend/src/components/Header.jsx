import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { admin } = useAuth();
  const itemCount = getItemCount();

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="bg-leather-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-3xl font-bold tracking-wider text-gold-400">
              RELUX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-wider transition-colors duration-200 ${
                    isActive
                      ? 'text-gold-400 border-b-2 border-gold-400 pb-1'
                      : 'text-leather-200 hover:text-gold-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/carrito"
              className="relative p-2 text-leather-200 hover:text-gold-400 transition-colors"
            >
              <ShoppingBag size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-leather-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {admin ? (
              <Link
                to="/admin"
                className="p-2 text-gold-400 hover:text-gold-300 transition-colors"
                title="Panel Admin"
              >
                <User size={24} />
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 text-leather-200 hover:text-gold-400 transition-colors"
                title="Acceso Admin"
              >
                <User size={24} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/carrito" className="relative p-2">
              <ShoppingBag size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-leather-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-leather-700">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-sm uppercase tracking-wider ${
                    isActive ? 'text-gold-400' : 'text-leather-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={admin ? '/admin' : '/admin/login'}
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 text-sm uppercase tracking-wider text-leather-200"
            >
              {admin ? 'Panel Admin' : 'Acceso Admin'}
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

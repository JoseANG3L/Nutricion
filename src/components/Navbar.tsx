import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Apple, Menu, X, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Función para saber si un link está activo
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-green-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Apple size={24} className="text-white" />
          </div>
          <span className="font-black text-2xl text-gray-900 tracking-tight">
            Nutri<span className="text-green-600">Vida</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold transition-colors ${
                isActive(link.path) ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/citas" 
            className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 transition shadow-md flex items-center gap-2"
          >
            <Calendar size={18} />
            Agendar Cita
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-bold ${
                  isActive(link.path) ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/citas" 
              onClick={() => setIsOpen(false)}
              className="bg-green-600 text-white p-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Agendar Cita
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
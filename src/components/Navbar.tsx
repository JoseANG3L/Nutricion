import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Apple, Menu, X, Calendar, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth'; // Importación de tipo estricta

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Escuchar estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Seguimiento', path: '/seguimiento' },
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

          {/* Mostrar Panel y Logout si hay sesión, sino mostrar Agendar Cita */}
          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 font-bold ${isActive('/admin') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                <LayoutDashboard size={18} />
                Panel
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition-colors"
              >
                <LogOut size={18} />
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
               <Link to="/login" className="text-gray-400 hover:text-gray-600">
                <UserIcon size={18} />
              </Link>
              <Link 
                to="/citas" 
                className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 transition shadow-md flex items-center gap-2"
              >
                <Calendar size={18} />
                Agendar Cita
              </Link>
            </div>
          )}
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
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 animate-in slide-in-from-top duration-300 shadow-xl">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-bold ${isActive(link.path) ? 'text-green-600' : 'text-gray-600'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-gray-100 my-2" />

            {user ? (
              <>
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-lg font-bold text-blue-600"
                >
                  <LayoutDashboard size={20} /> Panel Admin
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-lg font-bold text-red-500"
                >
                  <LogOut size={20} /> Cerrar Sesión
                </button>
              </>
            ) : (
              <Link 
                to="/citas" 
                onClick={() => setIsOpen(false)}
                className="bg-green-600 text-white p-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Agendar Cita
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
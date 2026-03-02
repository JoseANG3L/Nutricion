import { Link } from 'react-router-dom';
import { Apple, Mail, Phone, Instagram, Facebook, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Columna 1: Branding y Cédula */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl">
            <Apple className="text-green-500" size={32} />
            <span>NutriVida</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Mejorando vidas a través de la nutrición consciente y personalizada. 
            Salud integral para tu día a día.
          </p>
          <div className="pt-2">
            <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-400">
              Cédula Prof: 123456789
            </span>
          </div>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 className="text-white font-semibold mb-6">Navegación</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-green-400 transition">Inicio</Link></li>
            <li><Link to="/blog" className="hover:text-green-400 transition">Blog Nutricional</Link></li>
            <li><Link to="/citas" className="hover:text-green-400 transition">Agendar Cita</Link></li>
            <li><Link to="/admin" className="hover:text-green-400 transition text-gray-500 italic">Acceso Nutrióloga</Link></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h4 className="text-white font-semibold mb-6">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-green-500" />
              <span>+52 555 123 4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-green-500" />
              <span>contacto@nutrivida.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-green-500" />
              <span>Av. Salud 123, CDMX</span>
            </li>
          </ul>
        </div>

        {/* Columna 4: Redes Sociales */}
        <div>
          <h4 className="text-white font-semibold mb-6">Sígueme</h4>
          <div className="flex gap-4">
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition text-white">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-green-600 transition text-white">
              <Facebook size={20} />
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            Suscríbete para recibir tips semanales.
          </p>
        </div>
      </div>

      {/* Barra Inferior de Copyright */}
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <p>© {currentYear} NutriVida - LN. Ana García. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">Aviso de Privacidad</a>
          <a href="#" className="hover:text-white transition">Términos y Condiciones</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
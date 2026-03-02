import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, Activity, Heart, ArrowRight, Calendar } from 'lucide-react';
import type { Service } from '../types/types';

const SERVICES: Service[] = [
  {
    title: "Plan Personalizado",
    description: "Diseño de menús basados en tus objetivos, gustos y metabolismo único.",
    icon: <Apple size={32} />,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Nutrición Clínica",
    description: "Tratamiento especializado para diabetes, hipertensión y salud hormonal.",
    icon: <Activity size={32} />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Bienestar Integral",
    description: "Mejora tu relación con la comida mediante alimentación consciente.",
    icon: <Heart size={32} />,
    color: "bg-red-100 text-red-600"
  }
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-b from-green-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Come para vivir, <br />
              <span className="text-green-600">no vivas para comer.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Soy la LN. Ana García. Te ayudo a alcanzar tu mejor versión con ciencia y empatía, sin dietas imposibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/citas" 
                className="bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Agendar Consulta
              </Link>
              <Link 
                to="/blog" 
                className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                Ver Blog
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-[400px] bg-green-200 rounded-[2rem] overflow-hidden rotate-3 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800" 
                alt="Nutrióloga Profesional" 
                className="w-full h-full object-cover -rotate-3 scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE SERVICIOS --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">¿Cómo puedo ayudarte?</h2>
          <p className="text-gray-500 mt-2">Soluciones nutricionales adaptadas a tu ritmo de vida.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div key={index} className="p-8 rounded-3xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-xl transition-all group">
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
              <Link to="/citas" className="text-green-600 font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Saber más <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="bg-green-600 py-16 px-6 my-10 rounded-[3rem] max-w-6xl mx-auto w-full text-white text-center shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">¿Listo para empezar tu cambio?</h2>
        <p className="mb-8 opacity-90">La primera consulta incluye evaluación corporal completa y plan inicial.</p>
        <Link 
          to="/citas" 
          className="bg-white text-green-700 px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform inline-block"
        >
          ¡Quiero mi plan!
        </Link>
      </section>

    </div>
  );
};

export default Home;
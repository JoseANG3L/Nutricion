import React, { useState } from 'react';
import type { Cita } from '../types';

const Citas: React.FC = () => {
  // Usamos la interfaz Cita para el estado
  const [formData, setFormData] = useState<Partial<Cita>>({
    nombre: '',
    whatsapp: '',
    fecha: '',
    status: 'pendiente'
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <input 
        type="text" 
        placeholder="Tu nombre"
        className="border p-2 w-full mb-4"
        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
      />
      {/* Resto de campos... */}
      <button type="submit" className="bg-green-600 text-white p-2 w-full">
        Reservar
      </button>
    </form>
  );
};
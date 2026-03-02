import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types/types';
import { Calendar, Clock, User, Phone, CheckCircle2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const HOURS = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "15:00", "16:00", "17:00", "18:00"
];

const Citas: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Partial<Appointment>>({
    patientName: '',
    phone: '',
    date: '',
    time: '',
    reason: 'Consulta General'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const docRef = await addDoc(collection(db, "citas"), {
        ...form,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      console.log("Cita guardada con ID: ", docRef.id);
      setStep(3); // Mostrar éxito
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al agendar. Intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Reserva tu Espacio</h1>
        <p className="text-gray-500 mt-2">Cada sesión tiene una duración de 60 minutos.</p>
      </div>

      {step < 3 ? (
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* COLUMNA 1: Fecha y Hora */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                <Calendar className="text-green-600" size={20} />
                1. Selecciona el día
              </h2>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]} // Evita fechas pasadas
                className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 font-medium"
                onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                <Clock className="text-green-600" size={20} />
                2. Horarios disponibles (1 hora c/u)
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {HOURS.map((hora) => (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => setForm({...form, time: hora})}
                    className={`py-3 rounded-xl font-bold transition-all border ${
                      form.time === hora 
                      ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA 2: Formulario Final */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl h-fit sticky top-24">
            <h2 className="font-bold text-gray-800 mb-6">Datos de contacto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 text-gray-300" size={18} />
                  <input 
                    type="text" required
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Tu nombre completo"
                    onChange={e => setForm({...form, patientName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">WhatsApp</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 text-gray-300" size={18} />
                  <input 
                    type="tel" required
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="55 0000 0000"
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Fecha:</span>
                  <span className="font-bold">{form.date || 'No elegida'}</span>
                </div>
                <div className="flex justify-between text-sm mb-6">
                  <span className="text-gray-500">Hora:</span>
                  <span className="font-bold">{form.time ? `${form.time} hrs` : 'No elegida'}</span>
                </div>

                <button 
                  disabled={!form.date || !form.time}
                  className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transition disabled:bg-gray-200 disabled:shadow-none"
                >
                  RESERVAR AHORA
                </button>
              </div>
            </form>
          </div>

        </div>
      ) : (
        /* VISTA DE CONFIRMACIÓN */
        <div className="max-w-md mx-auto bg-white p-10 rounded-[3rem] shadow-2xl border border-green-50 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">¡Cita Solicitada!</h2>
          <p className="text-gray-600 mb-6">
            Hola <span className="text-green-600 font-bold">{form.patientName}</span>, hemos recibido tu solicitud para el día <span className="font-bold">{form.date}</span> a las <span className="font-bold">{form.time}</span>.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-green-600 font-bold hover:underline"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
};

export default Citas;
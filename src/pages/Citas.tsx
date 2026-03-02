import React, { useState } from 'react';
import type { Appointment } from '../types/types';
import { Calendar, Clock, User, Phone, CheckCircle2, MessageSquare, ClipboardList } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';


const generarFolioAleatorio = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
};

const HOURS = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "15:00", "16:00", "17:00", "18:00"
];

const REASONS = [
  "Consulta General",
  "Control de Peso",
  "Plan Alimenticio",
  "Nutrición Deportiva",
  "Seguimiento"
];

const Citas: React.FC = () => {
  const [step, setStep] = useState(1);
  const [folio, setFolio] = useState('');
  const [form, setForm] = useState<Partial<Appointment>>({
    folio: '',
    patientName: '',
    phone: '',
    date: '',
    time: '',
    reason: 'Consulta General',
    details: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoFolio = generarFolioAleatorio();

    try {
      await addDoc(collection(db, "citas"), {
        ...form,
        folio: nuevoFolio,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setFolio(nuevoFolio);
      setStep(3);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al agendar. Intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 italic">Reserva tu Espacio</h1>
        <p className="text-gray-500 mt-2">Cada sesión tiene una duración de 60 minutos.</p>
      </div>

      {step < 3 ? (
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* COLUMNA 1: Selección de Tiempo */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4 tracking-tight">
                <Calendar className="text-green-600" size={22} />
                1. Selecciona el día
              </h2>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 font-bold text-gray-700"
                onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4 tracking-tight">
                <Clock className="text-green-600" size={22} />
                2. Horarios disponibles (1 hora)
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {HOURS.map((hora) => (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => setForm({...form, time: hora})}
                    className={`py-3 rounded-xl font-black transition-all border ${
                      form.time === hora 
                      ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA 2: Formulario de Datos */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl h-fit sticky top-24">
            <h2 className="font-black text-2xl text-gray-900 mb-6 italic tracking-tight">Tus Datos</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Nombre Completo</label>
                <div className="relative mt-1">
                  <User className="absolute left-4 top-3.5 text-gray-300" size={18} />
                  <input 
                    type="text" required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50/50"
                    placeholder="Escribe tu nombre"
                    onChange={e => setForm({...form, patientName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">WhatsApp</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-4 top-3.5 text-gray-300" size={18} />
                  <input 
                    type="tel" required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50/50"
                    placeholder="228 123 4567"
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Motivo de Consulta</label>
                <div className="relative mt-1">
                  <ClipboardList className="absolute left-4 top-3.5 text-gray-300" size={18} />
                  <select 
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50/50 appearance-none font-medium text-gray-700"
                    onChange={e => setForm({...form, reason: e.target.value})}
                  >
                    {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Detalles o Dudas</label>
                <div className="relative mt-1">
                  <MessageSquare className="absolute left-4 top-3.5 text-gray-300" size={18} />
                  <textarea 
                    rows={3}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50/50 resize-none text-sm"
                    placeholder="Cuéntanos un poco más..."
                    onChange={e => setForm({...form, details: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 mt-6">
                <div className="flex justify-between text-sm mb-6">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Fecha y Hora</span>
                    <span className="font-black text-gray-800">
                      {form.date && form.time ? `${form.date} @ ${form.time} hrs` : 'Pendiente'}
                    </span>
                  </div>
                </div>

                <button 
                  disabled={!form.date || !form.time || !form.patientName}
                  className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 transition-all transform active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                >
                  CONFIRMAR CITA
                </button>
              </div>
            </form>
          </div>

        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border border-green-50 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="text-green-600" size={56} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 italic">¡Todo listo!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Hola <span className="text-green-600 font-bold">{form.patientName}</span>, tu solicitud para el <span className="font-bold">{form.date}</span> ha sido registrada.
          </p>

          <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 shadow-xl relative">
            {/* Círculos laterales para efecto de ticket cortado */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full border-r-2 border-gray-100"></div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full border-l-2 border-gray-100"></div>

            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-2">
              Comprobante de Registro
            </span>
            
            <div className="py-4 border-y-2 border-dashed border-gray-100 my-4">
              <span className="text-xs text-gray-500 font-bold">FOLIO ÚNICO:</span>
              <div className="text-5xl font-mono font-black text-green-600 tracking-tighter mt-1">
                {folio}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left mt-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Fecha</p>
                <p className="font-bold text-gray-700">{form.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Hora</p>
                <p className="font-bold text-gray-700">{form.time} hrs</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
};

export default Citas;
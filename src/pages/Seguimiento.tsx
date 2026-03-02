import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Appointment } from '../types/types';
import { Search, Calendar, Clock, CheckCircle, Clock4, ShieldCheck, MapPin } from 'lucide-react';

const Seguimiento: React.FC = () => {
  const [busqueda, setBusqueda] = useState({ folio: '', phone: '' });
  const [cita, setCita] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarCita = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCita(null);

    try {
      const q = query(
        collection(db, "citas"), 
        where("folio", "==", busqueda.folio.toUpperCase()),
        where("phone", "==", busqueda.phone)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('No encontramos ninguna cita con esos datos. Verifica el folio y el teléfono.');
      } else {
        const data = querySnapshot.docs[0].data() as Appointment;
        setCita({ id: querySnapshot.docs[0].id, ...data });
      }
    } catch (err) {
      setError('Hubo un error al buscar. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 italic tracking-tight">Seguimiento de Cita</h1>
        <p className="text-gray-500 mt-3">Ingresa tus datos para conocer el estado de tu consulta.</p>
      </div>

      {!cita ? (
        /* FORMULARIO DE BÚSQUEDA */
        <div className="max-w-md mx-auto bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
          <form onSubmit={buscarCita} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Folio de 6 dígitos</label>
              <input 
                type="text" required
                placeholder="Ej: X7R29A"
                className="w-full p-4 mt-1 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 font-mono text-xl uppercase font-bold"
                onChange={e => setBusqueda({...busqueda, folio: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp registrado</label>
              <input 
                type="tel" required
                placeholder="2281234567"
                className="w-full p-4 mt-1 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                onChange={e => setBusqueda({...busqueda, phone: e.target.value})}
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <button 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Buscando...' : <><Search size={20} /> Consultar Estado</>}
            </button>
          </form>
        </div>
      ) : (
        /* PANEL DE RESULTADO */
        <div className="animate-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
            {/* Cabecera del Estado */}
            <div className={`p-8 text-center ${cita.status === 'confirmed' ? 'bg-green-600' : 'bg-yellow-500'} text-white`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                {cita.status === 'confirmed' ? <CheckCircle size={32} /> : <Clock4 size={32} />}
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {cita.status === 'confirmed' ? 'Cita Confirmada' : 'En Espera de Confirmación'}
              </h2>
              <p className="opacity-80 font-medium">Folio: #{cita.folio}</p>
            </div>

            {/* Detalles de la Cita */}
            <div className="p-8 md:p-12 grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-400"><Calendar size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha Agendada</p>
                    <p className="text-xl font-bold text-gray-800">{cita.date}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-400"><Clock size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horario</p>
                    <p className="text-xl font-bold text-gray-800">{cita.time} hrs <span className="text-sm font-normal text-gray-400">(60 min)</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-400"><ShieldCheck size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paciente</p>
                    <p className="text-xl font-bold text-gray-800">{cita.patientName}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-400"><MapPin size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación</p>
                    <p className="text-sm font-bold text-gray-800">Consultorio Xalapa, Ver.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas Finales */}
            <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-gray-500 text-center md:text-left max-w-sm">
                Si necesitas reprogramar, por favor contáctanos con 24 horas de anticipación citando tu folio.
              </p>
              <button 
                onClick={() => setCita(null)}
                className="text-gray-400 font-bold hover:text-gray-900 transition-colors"
              >
                Nueva consulta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seguimiento;
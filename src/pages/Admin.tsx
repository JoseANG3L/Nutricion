import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Phone, CheckCircle, XCircle, ExternalLink, Play } from 'lucide-react';
import type { Appointment } from '../types/types';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Función para determinar el estado temporal de la cita
const obtenerEstadoTemporal = (fechaCita: string, horaCita: string) => {
  const ahora = new Date();
  
  // Dividimos la fecha (YYYY-MM-DD) y la hora (HH:mm)
  const [year, month, day] = fechaCita.split('-').map(Number);
  const [horas, minutos] = horaCita.split(':').map(Number);
  
  // Creamos la fecha de inicio usando el constructor local (año, mes-1, día, horas, minutos)
  const inicio = new Date(year, month - 1, day, horas, minutos);
  
  // La cita dura 1 hora exacto
  const fin = new Date(inicio.getTime() + (60 * 60 * 1000));

  if (ahora > fin) return 'terminada';
  if (ahora >= inicio && ahora <= fin) return 'en-proceso';
  
  // Si falta menos de 30 minutos
  const diferenciaMin = (inicio.getTime() - ahora.getTime()) / (1000 * 60);
  if (diferenciaMin > 0 && diferenciaMin <= 30) return 'proxima';
  
  return 'futura';
};

const Admin: React.FC = () => {
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const q = query(collection(db, "citas"), orderBy("date", "asc"), orderBy("time", "asc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setCitas(docs);
    });

    // Actualizar el estado temporal cada minuto automáticamente
    const timer = setInterval(() => setTiempoActual(new Date()), 60000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: 'pending' | 'confirmed') => {
    const docRef = doc(db, "citas", id);
    await updateDoc(docRef, { status: nuevoEstado });
  };

  const eliminarCita = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta cita?")) {
      await deleteDoc(doc(db, "citas", id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Agenda de Consultas</h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2 font-medium">
            <Calendar size={18} className="text-green-600" /> 
            {tiempoActual.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
            <span className="text-3xl font-black text-green-600">{citas.filter(c => c.date === hoy).length}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Citas hoy</span>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
            <span className="text-3xl font-black text-blue-600">{citas.length}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total</span>
          </div>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="space-y-6">
        {citas.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No hay citas agendadas.</p>
          </div>
        ) : (
          citas.map((cita) => {
            const estadoTemp = obtenerEstadoTemporal(cita.date, cita.time);
            
            // Configuración de estilos por estado
            const configEstilos = {
              'en-proceso': 'border-green-500 bg-green-50/30 ring-4 ring-green-100 shadow-green-200',
              'proxima': 'border-blue-400 bg-blue-50/50 shadow-blue-100 animate-pulse',
              'terminada': 'opacity-50 grayscale border-gray-200 bg-gray-50',
              'futura': 'border-gray-100 bg-white'
            }[estadoTemp];

            return (
              <div 
                key={cita.id} 
                className={`relative overflow-hidden p-1 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center ${configEstilos}`}
              >
                {/* BLOQUE DE TIEMPO */}
                <div className={`md:w-48 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100`}>
                  <span className={`text-4xl font-black tracking-tighter ${estadoTemp === 'en-proceso' ? 'text-green-700' : 'text-gray-800'}`}>
                    {cita.time}
                  </span>
                  
                  {/* BADGES DE ESTADO DINÁMICOS */}
                  <div className="mt-2">
                    {estadoTemp === 'en-proceso' && (
                      <span className="px-3 py-1 bg-green-600 text-white text-[9px] font-black rounded-full uppercase flex items-center gap-1">
                        <Play size={8} fill="currentColor" /> En Consulta
                      </span>
                    )}
                    {estadoTemp === 'proxima' && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase">
                        Próxima
                      </span>
                    )}
                    {estadoTemp === 'terminada' && (
                      <span className="px-3 py-1 bg-gray-400 text-white text-[9px] font-black rounded-full uppercase">
                        Finalizada
                      </span>
                    )}
                    {estadoTemp === 'futura' && cita.date === hoy && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[9px] font-black rounded-full uppercase border">
                        Hoy
                      </span>
                    )}
                  </div>
                </div>

                {/* DATOS DEL PACIENTE */}
                <div className="grow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    {/* Fila Superior: Nombre y Status */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900 leading-none">{cita.patientName}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        cita.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {cita.status === 'confirmed' ? 'Confirmado' : 'Por confirmar'}
                      </span>
                    </div>

                    {/* SECCIÓN DEL MOTIVO (Destacada) */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Motivo:</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {cita.reason || "Consulta General"}
                      </span>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                          Notas del Paciente
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        {cita.details ? `"${cita.details}"` : "El paciente no proporcionó detalles adicionales."}
                      </p>
                    </div>

                    {/* Fila Inferior: Fecha y WhatsApp */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-gray-300" /> 
                        {new Date(cita.date + "T00:00:00").toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </span>
                      <a 
                        href={`https://wa.me/${cita.phone}`} 
                        target="_blank" 
                        className="flex items-center gap-1.5 text-green-600 font-bold hover:bg-green-50 px-2 py-1 rounded-lg transition-colors"
                      >
                        <Phone size={14} /> {cita.phone} <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="flex items-center gap-2">
                    {estadoTemp !== 'terminada' && cita.status === 'pending' && (
                      <button 
                        onClick={() => cambiarEstado(cita.id!, 'confirmed')}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                      >
                        <CheckCircle size={18} /> Confirmar
                      </button>
                    )}
                    <button 
                      onClick={() => eliminarCita(cita.id!)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Eliminar cita"
                    >
                      <XCircle size={22} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Admin;
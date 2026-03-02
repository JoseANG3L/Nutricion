import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Phone, User, CheckCircle, XCircle } from 'lucide-react';
import type { Appointment } from '../types/types'; // Importación de tipo estricta
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Admin: React.FC = () => {
  const [citas, setCitas] = useState<Appointment[]>([]);

  useEffect(() => {
    // Consulta las citas ordenadas por fecha de creación
    const q = query(collection(db, "citas"), orderBy("date", "asc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setCitas(docs);
    });

    return () => unsubscribe(); // Limpiar conexión al salir
  }, []);

  const cambiarEstado = (id: string, nuevoEstado: 'pending' | 'confirmed') => {
    setCitas(citas.map(c => c.id === id ? { ...c, status: nuevoEstado } : c));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 italic">Panel de Citas</h1>
          <p className="text-gray-500">Gestiona las consultas de tus pacientes.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 font-bold">
              {citas.length}
            </div>
            <span className="text-sm font-medium text-gray-600">Total Citas</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Paciente</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha y Hora</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Contacto</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {citas.map((cita) => (
                <tr key={cita.id} className="hover:bg-green-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                        {cita.patientName[0]}
                      </div>
                      <span className="font-bold text-gray-800">{cita.patientName}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        <Calendar size={14} /> {cita.date}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> {cita.time} hrs (1h)
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <a 
                      href={`https://wa.me/${cita.phone}`} 
                      target="_blank" 
                      className="flex items-center gap-2 text-sm font-medium text-green-600 hover:underline"
                    >
                      <Phone size={16} />
                      {cita.phone}
                    </a>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                      cita.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {cita.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      {cita.status === 'pending' && (
                        <button 
                          onClick={() => cambiarEstado(cita.id!, 'confirmed')}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                          title="Confirmar Cita"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button 
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                        title="Cancelar Cita"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
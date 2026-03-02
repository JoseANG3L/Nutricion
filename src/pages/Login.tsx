import React, { useState } from 'react';
import { auth } from '../firebase/config'; // Asegúrate de exportar auth en tu config
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin'); // Si es correcto, vas al panel
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex justify-center items-center h-[60vh]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl border w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 italic">Acceso Nutrióloga</h2>
        <input 
          type="email" placeholder="Correo" 
          className="w-full p-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Contraseña" 
          className="w-full p-3 border rounded-xl mb-6 outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
          Entrar al Panel
        </button>
      </form>
    </div>
  );
};

export default Login;
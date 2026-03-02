import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, User, Tag } from 'lucide-react';
import type { Post } from '../types/types';

// En un proyecto real, esto vendría de una API o Firebase
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: '5 Tips para una mejor digestión',
    excerpt: 'Pequeños cambios en tu rutina...',
    content: `
      La digestión es la base de nuestra salud. Para mejorarla, es vital considerar:
      1. Masticar adecuadamente: Cada bocado debería procesarse 20-30 veces.
      2. Hidratación: Beber agua fuera de las comidas principales.
      3. Probióticos: Incorporar alimentos fermentados como el kéfir.
      
      Recuerda que cada cuerpo es diferente y lo que le funciona a uno puede no ser ideal para otro.
    `,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    date: '20 Feb, 2026',
    category: 'Bienestar'
  }
];

const PostDetail: React.FC = () => {
  // Capturamos el ID de la URL y le decimos a TS que es un string
  const { id } = useParams<{ id: string }>();

  // Buscamos el post correspondiente
  const post = MOCK_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
        <Link to="/blog" className="text-green-600 underline">Volver al blog</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header del Post */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-green-600 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Volver al Blog
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={14} className="mr-1" />
            {post.date}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mb-10 pb-10 border-b">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
            AG
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">LN. Ana García</p>
            <p className="text-xs text-gray-500">Especialista en Nutrición Clínica</p>
          </div>
        </div>
      </div>

      {/* Imagen Destacada */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-[400px] object-cover rounded-[2rem] shadow-2xl"
        />
      </div>

      {/* Cuerpo del Artículo */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="prose prose-lg prose-green text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
        
        {/* Sección de compartir o CTA */}
        <div className="mt-16 p-8 bg-green-50 rounded-3xl border border-green-100 text-center">
          <h3 className="text-xl font-bold text-green-800 mb-2">¿Te gustó este artículo?</h3>
          <p className="text-green-700 mb-6 text-sm">Agenda una consulta personalizada para profundizar en tu salud.</p>
          <Link to="/citas" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">
            Agendar Cita
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
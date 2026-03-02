import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types/types';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: '5 Tips para una mejor digestión',
    excerpt: 'Pequeños cambios en tu rutina que marcarán la diferencia...',
    content: '...',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500',
    date: '2026-02-20',
    category: 'Bienestar'
  }
];

const Blog: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Blog Nutricional</h1>
        <p className="text-gray-500 mt-2">Consejos expertos para tu salud</p>
      </header>
      
      <div className="grid md:grid-cols-3 gap-8">
        {MOCK_POSTS.map((post) => (
          <article key={post.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <span className="text-xs font-bold text-green-600 uppercase">{post.category}</span>
              <h2 className="text-xl font-bold mt-2 mb-3">{post.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="text-green-600 font-semibold text-sm hover:text-green-700">
                Leer artículo →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
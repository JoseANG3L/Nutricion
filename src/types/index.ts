// src/types/index.ts

export interface Post {
  id: string | number;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
}

export interface Cita {
  id?: string;
  nombre: string;
  whatsapp: string;
  fecha: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
}
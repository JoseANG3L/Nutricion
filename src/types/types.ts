// src/types/types.ts
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export interface Appointment {
  id?: string;
  folio: string;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  details?: string;
  status: 'pending' | 'confirmed';
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}
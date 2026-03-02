import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Navbar from './components/Navbar';
import Footer from './layout/Footer';

// Páginas
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Citas from './pages/Citas';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Rutas protegidas
import ProtectedRoute from './components/ProtectedRoute';
import Seguimiento from './pages/Seguimiento';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white font-sans">
        
        <Navbar />

        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<PostDetail />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            
            <Route path="/login" element={<Login />} />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-4xl font-bold text-green-600">404</h2>
                <p className="text-gray-500 mt-2">Página no encontrada</p>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminProductCreate } from '@/pages/admin/AdminProductCreate';
import { AdminProductEdit } from '@/pages/admin/AdminProductEdit';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/produto/:id" element={<ProductDetailPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Área Administrativa */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produtos" element={<AdminProducts />} />
          <Route path="produtos/criar" element={<AdminProductCreate />} />
          <Route path="produtos/:id/editar" element={<AdminProductEdit />} />
        </Route>
      </Routes>
    </Router>
  );
}

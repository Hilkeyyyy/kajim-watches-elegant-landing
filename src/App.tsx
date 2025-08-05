
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { HomePage } from '@/pages/HomePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import Auth from '@/pages/Auth';
import CategoryPage from '@/pages/CategoryPage';
import AdminLayout from '@/layouts/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import ProductCreate from '@/pages/admin/ProductCreate';
import ProductEdit from '@/pages/admin/ProductEdit';
import Categories from '@/pages/admin/Categories';
import Users from '@/pages/admin/Users';
import Reports from '@/pages/admin/Reports';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Páginas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/produto/:id" element={<ProductDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/categoria/:categoryId" element={<CategoryPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />

            {/* Rotas Administrativas */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="produtos" element={<Products />} />
              <Route path="produtos/novo" element={<ProductCreate />} />
              <Route path="produtos/editar/:id" element={<ProductEdit />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="usuarios" element={<Users />} />
              <Route path="relatorios" element={<Reports />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

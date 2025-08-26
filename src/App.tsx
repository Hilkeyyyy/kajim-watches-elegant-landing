
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundaryOptimized } from '@/components/ErrorBoundaryOptimized';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load pages
const Index = lazy(() => import('@/pages/Index'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const BrandPage = lazy(() => import('@/pages/BrandPage'));
const BuscarPage = lazy(() => import('@/pages/BuscarPage'));
const Auth = lazy(() => import('@/pages/Auth'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin pages
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Products = lazy(() => import('@/pages/admin/Products'));
const ProductCreate = lazy(() => import('@/pages/admin/ProductCreate'));
const ProductEdit = lazy(() => import('@/pages/admin/ProductEdit'));
const Categories = lazy(() => import('@/pages/admin/Categories'));
const SiteEditor = lazy(() => import('@/pages/admin/SiteEditor'));
const Reports = lazy(() => import('@/pages/admin/Reports'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundaryOptimized>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppProvider>
              <TooltipProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/produto/:id" element={<ProductDetailPage />} />
                      <Route path="/carrinho" element={<CartPage />} />
                      <Route path="/favoritos" element={<FavoritesPage />} />
                      <Route path="/buscar" element={<BuscarPage />} />
                      <Route path="/categoria/:id" element={<CategoryPage />} />
                      <Route path="/marca/:brand" element={<BrandPage />} />
                      <Route path="/auth" element={<Auth />} />

                      {/* Admin routes */}
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="produtos" element={<Products />} />
                        <Route path="produtos/novo" element={<ProductCreate />} />
                        <Route path="produtos/editar/:id" element={<ProductEdit />} />
                        <Route path="categorias" element={<Categories />} />
                        <Route path="editor" element={<SiteEditor />} />
                        <Route path="relatorios" element={<Reports />} />
                      </Route>

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Toaster />
                </div>
              </TooltipProvider>
            </AppProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundaryOptimized>
  );
}

export default App;

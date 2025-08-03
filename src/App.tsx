import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";

import Favorites from "./pages/Favorites";
import Auth from "./pages/Auth";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => {
  console.log('App - Initializing application');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/produto/:id" element={<ProductDetail />} />
                    <Route path="/categoria/:categoryId" element={<CategoryPage />} />
                    
                    <Route path="/favoritos" element={<Favorites />} />
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="produtos" element={<Products />} />
                      <Route path="categorias" element={<Categories />} />
                      <Route path="usuarios" element={<Users />} />
                      <Route path="configuracoes" element={<Settings />} />
                    </Route>
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
            </TooltipProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

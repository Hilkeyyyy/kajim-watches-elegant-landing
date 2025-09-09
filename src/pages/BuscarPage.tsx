import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard as OptimizedProductCard } from '@/components/OptimizedProductCard';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Product } from '@/types/product';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { searchService } from '@/services/searchService';
import { formatPrice } from '@/utils/priceUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const BuscarPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  // Sincroniza o estado com a URL (?q=...) quando o usuário faz uma nova busca
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchTerm(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  const isMounted = useRef(true);
  const requestIdRef = useRef(0);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    const currentId = ++requestIdRef.current;
    try {
      let products: Product[] = [];
      
      if (searchTerm.trim()) {
        // Usar o serviço de busca otimizado
        products = await searchService.searchProducts(searchTerm.trim(), 100);
      } else {
        // Usar o serviço de produtos para todos os produtos
        const { productService } = await import('@/services/productService');
        products = await productService.getAllProducts();
      }
      
      if (!isMounted.current || currentId !== requestIdRef.current) return;
      setProducts(products);
      setFilteredProducts(sortProducts(products, sortBy));
    } catch (error) {
      if (!isMounted.current || currentId !== requestIdRef.current) return;
      console.error('Erro ao buscar produtos:', error);
      handleError(error, 'Erro ao carregar produtos');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      if (!isMounted.current || currentId !== requestIdRef.current) return;
      setLoading(false);
    }
  };

  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    try {
      const sorted = [...products];
      sorted.sort((a, b) => {
        const aName = (a?.name || '').toString();
        const bName = (b?.name || '').toString();
        const aBrand = (a?.brand || '').toString();
        const bBrand = (b?.brand || '').toString();
        switch (sortBy) {
          case 'price_asc': {
            const priceA = parseFloat(String(a?.price ?? '0')) || 0;
            const priceB = parseFloat(String(b?.price ?? '0')) || 0;
            return priceA - priceB;
          }
          case 'price_desc': {
            const priceA2 = parseFloat(String(a?.price ?? '0')) || 0;
            const priceB2 = parseFloat(String(b?.price ?? '0')) || 0;
            return priceB2 - priceA2;
          }
          case 'brand':
            return aBrand.localeCompare(bBrand, 'pt-BR', { sensitivity: 'base' });
          case 'newest': {
            const dateA = a?.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b?.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          }
          case 'name':
          default:
            return aName.localeCompare(bName, 'pt-BR', { sensitivity: 'base' });
        }
      });
      return sorted;
    } catch (e) {
      console.warn('Safe sort fallback due to data issue:', e);
      return [...products];
    }
  };

  // Atualizar filteredProducts quando sortBy mudar
  useEffect(() => {
    setFilteredProducts(sortProducts(products, sortBy));
  }, [products, sortBy]);


  const handleProductClick = (id: string) => {
    navigate(`/produto/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Buscar Relógios
            </h1>
            <p className="text-muted-foreground">
              Encontre o relógio perfeito para você
            </p>
          </div>

          {/* Search Bar */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-card/95 to-card/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Buscar por nome, marca ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base border-0 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 h-12 border-0 bg-background/50 backdrop-blur-sm">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome A-Z</SelectItem>
                      <SelectItem value="brand">Marca A-Z</SelectItem>
                      <SelectItem value="price_asc">Preço: Menor → Maior</SelectItem>
                      <SelectItem value="price_desc">Preço: Maior → Menor</SelectItem>
                      <SelectItem value="newest">Mais novos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in w-full max-w-sm transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <OptimizedProductCard
                    product={product}
                    onProductClick={handleProductClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-muted/20 border-dashed">
              <CardContent>
                <div className="space-y-4">
                  <Search className="w-16 h-16 text-muted-foreground/50 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Nenhum produto encontrado</h3>
                    <p className="text-muted-foreground">
                      Tente buscar com palavras diferentes ou navegue por categorias
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSortBy('name');
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Limpar Busca
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default BuscarPage;
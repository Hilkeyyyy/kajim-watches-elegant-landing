import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { MobileNavigation } from '@/components/MobileNavigation';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { SupabaseProduct, convertSupabaseToProduct } from '@/types/supabase-product';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [brandFilter, setBrandFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, products, sortBy, brandFilter, priceRange]);

  const fetchProducts = async () => {
    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'active');

      if (error) throw error;

      const products = (productsData as SupabaseProduct[] || []).map(convertSupabaseToProduct);
      setProducts(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }

    // Filtrar por marca
    if (brandFilter !== 'all') {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }

    // Filtrar por preço
    filtered = filtered.filter(product => {
      const price = Number(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return Number(a.price) - Number(b.price);
        case 'price_desc':
          return Number(b.price) - Number(a.price);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  // Extrair marcas únicas dos produtos
  const availableBrands = Array.from(new Set(products.map(p => p.brand))).sort();

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
                
                <div className="flex gap-2">
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12 border-0 bg-background/50 backdrop-blur-sm">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filtrar por marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as marcas</SelectItem>
                      {availableBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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
                  className="animate-fade-in w-full max-w-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
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
                    onClick={() => setSearchTerm('')}
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
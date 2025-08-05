
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';
import { apiService } from '@/services/api';
import { useApp } from '@/contexts/AppContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart, toggleFavorite, isFavorite } = useApp();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await apiService.getProduct(productId);
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product.id, product.name);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-32 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-6 rounded"></div>
                <div className="bg-gray-300 h-8 rounded"></div>
                <div className="bg-gray-300 h-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Button asChild>
              <Link to="/">Voltar à página inicial</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={images[selectedImage] || ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {product.price}
                </span>
              </div>

              {product.description && (
                <p className="text-muted-foreground mb-6">{product.description}</p>
              )}
            </div>

            {/* Ações */}
            <div className="flex space-x-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleFavorite}
                className={isFavorite(product.id) ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Especificações Técnicas */}
            <Card>
              <CardHeader>
                <CardTitle>Especificações Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {product.movement && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Movimento:</span>
                      <span>{product.movement}</span>
                    </div>
                  )}
                  {product.caliber && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Calibre:</span>
                      <span>{product.caliber}</span>
                    </div>
                  )}
                  {product.case_diameter && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Diâmetro da Caixa:</span>
                      <span>{product.case_diameter}</span>
                    </div>
                  )}
                  {product.case_material && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Material da Caixa:</span>
                      <span>{product.case_material}</span>
                    </div>
                  )}
                  {product.water_resistance && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Resistência à Água:</span>
                      <span>{product.water_resistance}</span>
                    </div>
                  )}
                  {product.crystal && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Cristal:</span>
                      <span>{product.crystal}</span>
                    </div>
                  )}
                  {product.dial_color && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Cor do Mostrador:</span>
                      <span>{product.dial_color}</span>
                    </div>
                  )}
                  {product.strap_material && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Material da Pulseira:</span>
                      <span>{product.strap_material}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Características */}
            {product.features && product.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Características</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

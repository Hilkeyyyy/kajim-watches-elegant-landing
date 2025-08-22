import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';
import { apiService } from '@/services/api';
import { useApp } from '@/contexts/AppContext';
import { formatPrice } from '@/utils/priceUtils';

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
                alt={`Relógio ${product.brand} ${product.name}`}
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
                {product.original_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(parseFloat(product.original_price))}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(parseFloat(product.price))}
                </span>
              </div>

              {product.description && (
                <p className="text-muted-foreground mb-6">{product.description}</p>
              )}
              
              {/* Original Guarantee - Elegante com glassmorphism */}
              <div className="relative bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-xl border border-border/20 rounded-2xl p-6 mb-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary/80 to-accent/80 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg">
                    100% ORIGINAL GARANTIDO
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Este relógio é <strong className="text-foreground">100% original</strong> e vem acompanhado de certificado de autenticidade. 
                  A KAJIM trabalha exclusivamente com relógios originais, nunca réplicas ou clones.
                </p>
                <div className="flex items-center gap-2 mt-3 text-muted-foreground text-xs">
                  <span>🏆</span>
                  <span className="font-semibold">Certificado de Autenticidade Incluso</span>
                </div>
              </div>
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

            {/* Especificações Técnicas COMPLETAS */}
            <Card>
              <CardHeader>
                <CardTitle>Especificações Técnicas Completas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Todas as especificações técnicas disponíveis do produto
                </p>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {(() => {
                  const groups: { title: string; items: Array<{ label: string; value?: string | number | boolean }> }[] = [
                    {
                      title: 'Básicas',
                      items: [
                        { label: 'Movimento', value: product.movement },
                        { label: 'Calibre', value: product.caliber },
                        { label: 'Tipo de Relógio', value: product.watch_type },
                        { label: 'Coleção', value: product.collection },
                        { label: 'Referência', value: product.reference_number },
                        { label: 'Ano de Produção', value: product.production_year },
                        { label: 'Nº de Joias', value: product.jewels_count },
                        { label: 'Frequência (Hz)', value: product.frequency_hz },
                        { label: 'Reserva de Marcha', value: product.power_reserve },
                        { label: 'Amplitude (°)', value: product.amplitude_degrees },
                        { label: 'Erro de Batida (ms)', value: product.beat_error_ms },
                      ],
                    },
                    {
                      title: 'Dimensões',
                      items: [
                        { label: 'Diâmetro da Caixa', value: product.case_diameter },
                        { label: 'Altura da Caixa', value: product.case_height },
                        { label: 'Espessura da Caixa', value: product.case_thickness || product.thickness },
                        { label: 'Lug to Lug', value: product.lug_to_lug },
                        { label: 'Largura entre Lugs (mm)', value: product.lug_width_mm || product.lug_width },
                        { label: 'Peso', value: product.weight },
                        { label: 'Diâmetro da Coroa', value: product.crown_diameter },
                        { label: 'Diâmetro do Cristal', value: product.crystal_diameter },
                        { label: 'Largura da Pulseira', value: product.bracelet_width },
                        { label: 'Comprimento da Pulseira', value: product.bracelet_length },
                      ],
                    },
                    {
                      title: 'Materiais',
                      items: [
                        { label: 'Material da Caixa', value: product.case_material || product.material },
                        { label: 'Material do Bisel', value: product.bezel_material },
                        { label: 'Cristal', value: product.crystal || product.glass_type },
                        { label: 'Material do Mostrador', value: product.dial_material },
                        { label: 'Material dos Ponteiros', value: product.hands_material },
                        { label: 'Material da Coroa', value: product.crown_material },
                        { label: 'Material do Fundo', value: product.caseback_material },
                        { label: 'Material da Pulseira', value: product.bracelet_material || product.strap_material },
                        { label: 'Material do Fecho', value: product.clasp_material },
                        { label: 'Material dos Índices', value: product.indices_material },
                      ],
                    },
                    {
                      title: 'Cores e Acabamentos',
                      items: [
                        { label: 'Cor do Mostrador', value: product.dial_color },
                        { label: 'Cores do Mostrador', value: product.dial_colors?.join(', ') },
                        { label: 'Cor da Caixa', value: product.case_color },
                        { label: 'Cor do Bisel', value: product.bezel_color },
                        { label: 'Cor dos Ponteiros', value: product.hands_color },
                        { label: 'Cor dos Marcadores', value: product.markers_color },
                        { label: 'Cor da Pulseira', value: product.strap_color },
                        { label: 'Textura do Mostrador', value: product.dial_pattern },
                        { label: 'Acabamento do Mostrador', value: product.dial_finish },
                      ],
                    },
                    {
                      title: 'Avançadas',
                      items: [
                        { label: 'Resistência à Água (m)', value: product.water_resistance_meters || product.water_resistance },
                        { label: 'Resistência à Água (ATM)', value: product.water_resistance_atm },
                        { label: 'Resistência Magnética', value: product.anti_magnetic_resistance },
                        { label: 'Resistência a Choques', value: typeof product.shock_resistant === 'boolean' ? (product.shock_resistant ? 'Sim' : 'Não') : undefined },
                        { label: 'Resistência à Temperatura', value: product.temperature_resistance },
                        { label: 'Tipo de Índices', value: product.indices_type },
                        { label: 'Tipo de Algarismos', value: product.numerals_type },
                        { label: 'Tipo de Ponteiros', value: product.hands_type },
                        { label: 'Tipo de Lume', value: product.lume_type },
                        { label: 'Tipo de Coroa', value: product.crown_type },
                        { label: 'Fundo da Caixa', value: product.case_back },
                        { label: 'Tipo de Bisel', value: product.bezel_type },
                        { label: 'Tipo de Fecho', value: product.clasp_type },
                        { label: 'Tipo de Fivela', value: product.buckle_type },
                        { label: 'Certificação', value: product.certification },
                        { label: 'Garantia', value: product.warranty },
                        { label: 'País de Origem', value: product.country_origin },
                        { label: 'Edição Limitada', value: product.limited_edition },
                      ],
                    },
                    {
                      title: 'Comerciais',
                      items: [
                        { label: 'MSRP', value: product.msrp },
                        { label: 'Disponibilidade', value: product.availability_status },
                        { label: 'Modelo de Substituição', value: product.replacement_model },
                        { label: 'Tipo de Caixa/Embalagem', value: product.box_type },
                        { label: 'Documentação', value: product.documentation },
                      ],
                    },
                  ];

                  return (
                    <div className="space-y-8">
                      {groups.map((group) => {
                        const visible = group.items.filter((i) => i.value !== undefined && i.value !== '' && i.value !== null)
                        if (visible.length === 0) return null
                        return (
                          <div key={group.title} className="border rounded-lg p-4 bg-muted/20">
                            <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                              <span className="w-2 h-2 bg-primary rounded-full"></span>
                              {group.title}
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">
                                {visible.length} spec{visible.length !== 1 ? 's' : ''}
                              </span>
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {visible.map((i) => (
                                <div key={i.label} className="bg-background rounded-lg p-3 border shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex flex-col space-y-1">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{i.label}</span>
                                    <span className="text-base font-medium text-foreground break-words">{String(i.value)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* Contador total de especificações */}
                      <div className="text-center py-4 border-t bg-muted/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-bold text-primary">
                            {groups.reduce((acc, group) => 
                              acc + group.items.filter(i => i.value !== undefined && i.value !== '' && i.value !== null).length, 0
                            )}
                          </span> especificações técnicas completas exibidas
                        </p>
                      </div>
                    </div>
                  )
                })()}
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

export default ProductDetailPage;

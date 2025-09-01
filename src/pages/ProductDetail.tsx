import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MessageCircle, Shield, Truck, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductBadge } from "@/components/ProductBadge";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { FavoriteButton } from "@/components/FavoriteButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { getAllBadges } from "@/utils/badgeUtils";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { convertSupabaseToProduct } from "@/types/supabase-product";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { formatPrice } from "@/utils/priceUtils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_visible', true)
          .maybeSingle();

        if (error) {
          console.error('Error fetching product:', error);
          setProduct(null);
        } else if (data) {
          setProduct(convertSupabaseToProduct(data));
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-playfair mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à página inicial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const productUrl = `${window.location.origin}/produto/${product.id}`;
    const message = `Olá! Tenho interesse no ${product.name} (${formatPrice(parseFloat(product.price))}). Link: ${productUrl}`;
    const whatsappUrl = `https://wa.me/559181993435?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDirectPurchase = () => {
    const currentDate = new Date().toLocaleString('pt-BR');
    const productUrl = `${window.location.origin}/produto/${product.id}`;
    const message = `Olá! Tenho interesse no seguinte produto:%0A%0A` +
      `1. ${product.name}%0A` +
      `Quantidade: 1%0A` +
      `Preço: ${formatPrice(parseFloat(product.price))}%0A` +
      `Link: ${productUrl}%0A%0A` +
      `Data/Hora do pedido: ${currentDate}`;

    const whatsappUrl = `https://wa.me/559181993435?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <ProductImageGallery 
              images={product.images} 
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-inter text-sm text-muted-foreground mb-2">
                    <span className="notranslate" translate="no">{product.brand}</span>
                  </p>
                  <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary">
                    <span className="notranslate" translate="no">{product.name}</span>
                  </h1>
                  
                  {/* All Badges in Detail Page */}
                  {(() => {
                    const allBadges = getAllBadges(product);
                    return allBadges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {allBadges.map((badge, index) => (
                          <ProductBadge key={index} badge={badge} />
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <FavoriteButton productId={product.id} productName={product.name} />
              </div>
              
              <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(parseFloat(product.original_price))}
                    </span>
                  )}
                  <p className="font-playfair text-4xl font-bold text-primary">
                    {formatPrice(parseFloat(product.price))}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                }}
                variant="default"
                size="xl"
                className="w-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              />
              
              <Button 
                variant="primary" 
                size="lg"
                className="w-full font-inter font-semibold bg-green-600 text-white hover:bg-green-700"
                onClick={handleDirectPurchase}
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Comprar
              </Button>
            </div>

            {/* Features */}
            <Card className="p-6">
              <h3 className="font-playfair text-xl font-semibold mb-4">
                Características
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Technical Specifications - Reorganized */}
            <div className="space-y-6">
              {/* Basic Specifications */}
              <Card className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-4">
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Marca', value: product.brand },
                    { label: 'Modelo', value: product.model },
                    { label: 'Coleção', value: product.collection },
                    { label: 'Número de Referência', value: product.reference_number },
                    { label: 'Ano de Produção', value: product.production_year },
                    { label: 'País de Origem', value: product.country_origin },
                    { label: 'Edição Limitada', value: product.limited_edition },
                    { label: 'Certificação', value: product.certification },
                    { label: 'Garantia', value: product.warranty }
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Movement & Technical */}
              <Card className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-4">
                  Movimento e Especificações
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Movimento', value: product.movement },
                    { label: 'Calibre', value: product.caliber },
                    { label: 'Tipo de Relógio', value: product.watch_type },
                    { label: 'Rubis', value: product.jewels_count },
                    { label: 'Frequência', value: product.frequency_hz },
                    { label: 'Reserva de Marcha', value: product.power_reserve },
                    { label: 'Amplitude', value: product.amplitude_degrees },
                    { label: 'Erro de Batida', value: product.beat_error_ms }
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Dimensions */}
              <Card className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-4">
                  Dimensões e Medidas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Diâmetro da Caixa', value: product.case_diameter || product.case_size },
                    { label: 'Altura da Caixa', value: product.case_height },
                    { label: 'Espessura', value: product.case_thickness || product.thickness },
                    { label: 'Distância Lugs', value: product.lug_to_lug },
                    { label: 'Largura das Lugs', value: product.lug_width_mm || product.lug_width },
                    { label: 'Peso', value: product.weight },
                    { label: 'Diâmetro da Coroa', value: product.crown_diameter },
                    { label: 'Diâmetro do Cristal', value: product.crystal_diameter },
                    { label: 'Largura da Pulseira', value: product.bracelet_width },
                    { label: 'Comprimento da Pulseira', value: product.bracelet_length }
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Materials */}
              <Card className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-4">
                  Materiais e Construção
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Material da Caixa', value: product.case_material || product.material },
                    { label: 'Material do Bisel', value: product.bezel_material },
                    { label: 'Cristal/Vidro', value: product.crystal || product.glass_type },
                    { label: 'Material do Mostrador', value: product.dial_material },
                    { label: 'Material dos Ponteiros', value: product.hands_material },
                    { label: 'Material da Coroa', value: product.crown_material },
                    { label: 'Material do Fundo', value: product.caseback_material },
                    { label: 'Material da Pulseira', value: product.strap_material },
                    { label: 'Material do Bracelete', value: product.bracelet_material },
                    { label: 'Material do Fecho', value: product.clasp_material },
                    { label: 'Material dos Índices', value: product.indices_material }
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Colors and Finishes */}
              {(product.dial_color || product.case_color || product.bezel_color || product.hands_color) && (
                <Card className="p-6">
                  <h3 className="font-playfair text-xl font-semibold mb-4">
                    Cores e Acabamentos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Cor do Mostrador', value: product.dial_color },
                      { label: 'Cor da Caixa', value: product.case_color },
                      { label: 'Cor do Bisel', value: product.bezel_color },
                      { label: 'Cor dos Ponteiros', value: product.hands_color },
                      { label: 'Cor dos Marcadores', value: product.markers_color },
                      { label: 'Cor da Pulseira', value: product.strap_color },
                      { label: 'Padrão do Mostrador', value: product.dial_pattern },
                      { label: 'Acabamento do Mostrador', value: product.dial_finish }
                    ].filter(item => item.value).map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="font-medium text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {product.dial_colors && product.dial_colors.length > 0 && (
                    <div className="mt-4">
                      <span className="text-muted-foreground">Cores Disponíveis:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.dial_colors.map((color: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Resistance and Protection */}
              <Card className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-4">
                  Resistências e Proteções
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Resistência à Água (metros)', value: product.water_resistance_meters || product.water_resistance },
                    { label: 'Resistência à Água (ATM)', value: product.water_resistance_atm },
                    { label: 'Resistência Antimagnética', value: product.anti_magnetic_resistance },
                    { label: 'Resistente a Choques', value: product.shock_resistant ? 'Sim' : null },
                    { label: 'Resistência à Temperatura', value: product.temperature_resistance }
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Design Elements */}
              {(product.indices_type || product.numerals_type || product.hands_type) && (
                <Card className="p-6">
                  <h3 className="font-playfair text-xl font-semibold mb-4">
                    Elementos de Design
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Tipo de Índices', value: product.indices_type },
                      { label: 'Tipo de Numerais', value: product.numerals_type },
                      { label: 'Tipo de Ponteiros', value: product.hands_type },
                      { label: 'Tipo de Luminosidade', value: product.lume_type },
                      { label: 'Tipo de Coroa', value: product.crown_type },
                      { label: 'Fundo da Caixa', value: product.case_back },
                      { label: 'Tipo de Bisel', value: product.bezel_type },
                      { label: 'Tipo de Fecho', value: product.clasp_type },
                      { label: 'Tipo de Fivela', value: product.buckle_type }
                    ].filter(item => item.value).map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="font-medium text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-sm font-medium">Garantia</div>
                <div className="text-xs text-muted-foreground">2-3 anos</div>
              </div>
              
              <div className="text-center p-4">
                <Truck className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-sm font-medium">Frete Grátis</div>
                <div className="text-xs text-muted-foreground">Todo Brasil</div>
              </div>
              
              <div className="text-center p-4">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-sm font-medium">Troca</div>
                <div className="text-xs text-muted-foreground">30 dias</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
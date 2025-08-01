import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MessageCircle, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getProductById } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const product = id ? getProductById(id) : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-playfair mb-4">Produto não encontrado</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à página inicial
          </Button>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no ${product.name} (${product.price}). Poderia me fornecer mais informações?`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePurchase = () => {
    toast({
      title: "Redirecionando para checkout",
      description: `Preparando a compra do ${product.name}...`,
    });
    // Here you would integrate with your payment system
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="font-playfair text-xl font-bold">KAJIM</span>
            </div>
            
            <FavoriteButton productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="animate-fade-in">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="animate-slide-up space-y-6">
            <div>
              <h1 className="font-playfair text-3xl lg:text-4xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-primary">
                {product.price}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handlePurchase}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Comprar Agora
              </Button>
              
              <Button 
                variant="whatsapp" 
                size="lg" 
                className="w-full"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
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

            {/* Technical Details */}
            <Card className="p-6">
              <h3 className="font-playfair text-xl font-semibold mb-4">
                Especificações Técnicas
              </h3>
              <div className="space-y-3">
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

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
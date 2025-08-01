import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MessageCircle, Shield, Truck, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { FavoriteButton } from "@/components/FavoriteButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductById } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { useOptimizedCart } from "@/hooks/useOptimizedCart";
import Header from "@/components/Header";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useOptimizedCart();
  
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
    const whatsappUrl = `https://wa.me/5586988388124?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDirectPurchase = () => {
    const currentDate = new Date().toLocaleString('pt-BR');
    const message = `Olá, gostaria de saber mais sobre estes produtos:

1. ${product.name}
Quantidade: 1
Preço: ${product.price}
Imagem: ${product.image}

Data/Hora do pedido: ${currentDate}`;

    const whatsappUrl = `https://wa.me/5586988388124?text=${encodeURIComponent(message)}`;
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
            size="icon"
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
                    {product.details.brand}
                  </p>
                  <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary">
                    {product.name}
                  </h1>
                </div>
                <FavoriteButton productId={product.id} productName={product.name} />
              </div>
              
              <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="font-playfair text-4xl font-bold text-primary flex items-baseline">
                  <span className="text-2xl mr-2">R$</span>
                  <span>{product.price.replace('R$ ', '')}</span>
                </p>
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
                variant="default" 
                size="xl"
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
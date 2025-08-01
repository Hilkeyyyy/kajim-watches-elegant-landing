import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";

const ProductsSection = () => {
  const navigate = useNavigate();

  const handleWhatsApp = (productName: string) => {
    const message = `Olá! Tenho interesse no ${productName}. Gostaria de mais informações.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="products" className="py-20 px-6 bg-background">
      <div className="max-w-md mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
            Coleção Premium
          </h2>
          <p className="font-inter text-muted-foreground text-lg font-light">
            Descobra nossa seleção exclusiva
          </p>
        </div>

        {/* Products Grid */}
        <div className="space-y-12">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="bg-card rounded-xl shadow-card overflow-hidden hover:shadow-elegant transition-all duration-500 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => navigate(`/produto/${product.id}`)}
            >
              {/* Product Image */}
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6 text-center">
                <h3 className="font-playfair text-2xl font-semibold text-primary mb-2">
                  {product.name}
                </h3>
                <p className="font-inter text-muted-foreground mb-4 font-light">
                  {product.description}
                </p>
                <p className="font-playfair text-3xl font-bold text-primary mb-8">
                  {product.price}
                </p>
                
                {/* Action Buttons */}
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="luxury" 
                    size="lg"
                    className="w-full font-inter font-medium"
                    onClick={() => navigate(`/produto/${product.id}`)}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Ver Detalhes
                  </Button>
                  
                  <Button 
                    variant="whatsapp" 
                    size="lg"
                    className="w-full font-inter font-medium"
                    onClick={() => handleWhatsApp(product.name)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
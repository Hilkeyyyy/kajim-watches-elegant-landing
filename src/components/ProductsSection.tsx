import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag } from "lucide-react";
import watchesCollection from "@/assets/watches-collection.jpg";

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: "KAJIM Classic",
      price: "R$ 899",
      image: watchesCollection,
      description: "Elegância atemporal em cada detalhe"
    },
    {
      id: 2,
      name: "KAJIM Sport",
      price: "R$ 1.199",
      image: watchesCollection,
      description: "Performance e sofisticação"
    },
    {
      id: 3,
      name: "KAJIM Elite",
      price: "R$ 1.599",
      image: watchesCollection,
      description: "Exclusividade em sua forma mais pura"
    }
  ];

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
              className="bg-card rounded-xl shadow-card overflow-hidden hover:shadow-elegant transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
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
                <div className="space-y-4">
                  <Button 
                    variant="luxury" 
                    size="lg"
                    className="w-full font-inter font-medium"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Comprar Agora
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
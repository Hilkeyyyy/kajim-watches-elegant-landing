import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const BrandsCarousel = () => {
  const navigate = useNavigate();

  const brands = [
    {
      name: 'Patek Philippe',
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop',
      description: 'Tradição e excelência suíça'
    },
    {
      name: 'Rolex',
      image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop',
      description: 'Ícone de precisão e status'
    },
    {
      name: 'TAG Heuer',
      image: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=400&h=300&fit=crop',
      description: 'Esporte e elegância'
    }
  ];

  const handleBrandClick = (brandName: string) => {
    navigate(`/category?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold text-foreground mb-4">
            Explorar Categorias
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa coleção cuidadosamente organizada por estilo e moda
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {brands.map((brand, index) => (
              <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div 
                  className="group cursor-pointer"
                  onClick={() => handleBrandClick(brand.name)}
                >
                  <div className="relative overflow-hidden rounded-2xl h-80 bg-gradient-to-br from-muted/50 to-muted transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-elegant">
                    <img 
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-8 left-8 right-8 text-center">
                      <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2 transform group-hover:scale-105 transition-transform duration-300">
                        {brand.name}
                      </h3>
                      <p className="text-white/90 text-sm font-inter">
                        {brand.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-6 bg-background/80 hover:bg-background border-border" />
          <CarouselNext className="hidden sm:flex -right-6 bg-background/80 hover:bg-background border-border" />
        </Carousel>
      </div>
    </section>
  );
};

export default BrandsCarousel;
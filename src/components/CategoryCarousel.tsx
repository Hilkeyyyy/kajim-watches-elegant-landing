
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useBrandCategories } from "@/hooks/useBrandCategories";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const CategoryCarousel = () => {
  const { categories, isLoading } = useBrandCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (brand: string) => {
    // Navegar para página de produtos filtrados por marca
    navigate(`/marca/${encodeURIComponent(brand)}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Explorar por Marca
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Descubra nossa coleção organizada pelas melhores marcas de relógios do mundo
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category, index) => (
              <CarouselItem 
                key={category.brand_name} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div
                  onClick={() => handleCategoryClick(category.brand_name)}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border border-border/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Image */}
                  {(category.custom_image_url || category.default_image_url) && (
                    <img
                      src={category.custom_image_url || category.default_image_url}
                      alt={category.display_name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Gradient Overlay - sem efeito esbranquiçado */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/50" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 font-serif">
                      {category.display_name}
                    </h3>
                    <p className="text-white/90 text-sm font-medium">
                      {category.product_count || 0} {(category.product_count || 0) === 1 ? 'produto' : 'produtos'}
                    </p>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-2xl transition-all duration-300" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:border-primary text-foreground hover:text-primary-foreground transition-all duration-300 shadow-lg" />
          <CarouselNext className="hidden md:flex -right-12 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:border-primary text-foreground hover:text-primary-foreground transition-all duration-300 shadow-lg" />
        </Carousel>
      </div>
    </section>
  );
};

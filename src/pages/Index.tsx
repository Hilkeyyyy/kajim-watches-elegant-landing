import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { BrandCarousel } from "@/components/carousels/OptimizedBrandCarousel";
import { OffersCarousel, NewProductsCarousel } from "@/components/carousels/OptimizedCarousels";
import { FeaturedCarousel } from "@/components/carousels/OptimizedFeaturedCarousel";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useProductPrefetch } from "@/hooks/useProductPrefetch";

const Index = () => {
  const { settings } = useSiteSettings();
  
  // Prefetch inteligente de produtos para melhor performance
  useProductPrefetch();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      {settings.show_category_carousel && <CategoryCarousel />}
      <FeaturedCarousel />
      <BrandCarousel 
        brand="Rolex" 
        title="Coleção Rolex" 
        description="Ícones de precisão e status, relógios atemporais" 
      />
      <BrandCarousel 
        brand="Patek Philippe" 
        title="Coleção Patek Philippe" 
        description="Tradição e excelência suíça em cada detalhe" 
      />
      <BrandCarousel 
        brand="TAG Heuer" 
        title="Coleção TAG Heuer" 
        description="Esporte e elegância unidos na perfeição" 
      />
      <OffersCarousel />
      <NewProductsCarousel />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;

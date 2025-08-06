import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { BrandCarousel } from "@/components/carousels/BrandCarousel";
import { OffersCarousel } from "@/components/carousels/OffersCarousel";
import { NewProductsCarousel } from "@/components/carousels/NewProductsCarousel";
import { FeaturedCarousel } from "@/components/carousels/FeaturedCarousel";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
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
    </div>
  );
};

export default Index;

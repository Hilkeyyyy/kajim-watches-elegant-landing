import React, { Suspense } from "react";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { BrandCarousel } from "@/components/carousels/OptimizedBrandCarousel";
import { OffersCarousel, NewProductsCarousel } from "@/components/carousels/OptimizedCarousels";
import { FeaturedCarousel } from "@/components/carousels/OptimizedFeaturedCarousel";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { useSiteSettingsContext } from "@/contexts/SiteSettingsContext";
import { useProductPrefetch } from "@/hooks/useProductPrefetch";
import { FluidWrapper } from "@/components/FluidWrapper";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const { settings } = useSiteSettingsContext();
  
  // Prefetch inteligente de produtos para melhor performance
  useProductPrefetch();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <FluidWrapper enableParallax>
        <HeroSection />
      </FluidWrapper>
      
      {settings.show_category_carousel && (
        <FluidWrapper>
          <CategoryCarousel />
        </FluidWrapper>
      )}
      
      <FluidWrapper>
        <FeaturedCarousel />
      </FluidWrapper>
      
      <Suspense fallback={<LoadingSpinner />}>
        <FluidWrapper>
          <BrandCarousel 
            brand="Rolex" 
            title="Coleção Rolex" 
            description="Ícones de precisão e status, relógios atemporais" 
          />
        </FluidWrapper>
        
        <FluidWrapper>
          <BrandCarousel 
            brand="Patek Philippe" 
            title="Coleção Patek Philippe" 
            description="Tradição e excelência suíça em cada detalhe" 
          />
        </FluidWrapper>
        
        <FluidWrapper>
          <BrandCarousel 
            brand="TAG Heuer" 
            title="Coleção TAG Heuer" 
            description="Esporte e elegância unidos na perfeição" 
          />
        </FluidWrapper>
      </Suspense>
      
      <FluidWrapper>
        <OffersCarousel />
      </FluidWrapper>
      
      <FluidWrapper>
        <NewProductsCarousel />
      </FluidWrapper>
      
      <FluidWrapper>
        <AboutSection />
      </FluidWrapper>
      
      <Footer />
    </div>
  );
};

export default Index;


import React from 'react';
import { Header } from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { BrandCarousel } from '@/components/carousels/BrandCarousel';
import { OffersCarousel } from '@/components/carousels/OffersCarousel';
import { NewProductsCarousel } from '@/components/carousels/NewProductsCarousel';
import { FeaturedCarousel } from '@/components/carousels/FeaturedCarousel';
import AboutSection from '@/components/AboutSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Carrossel de Categorias */}
      <CategoryCarousel />
      
      {/* Produtos em Destaque */}
      <FeaturedCarousel />
      
      {/* Carrossel Rolex */}
      <BrandCarousel 
        brand="Rolex" 
        title="Coleção Rolex" 
        description="Ícones de precisão e status, relógios atemporais" 
      />
      
      {/* Carrossel Patek Philippe */}
      <BrandCarousel 
        brand="Patek Philippe" 
        title="Coleção Patek Philippe" 
        description="Tradição e excelência suíça em cada detalhe" 
      />
      
      {/* Carrossel TAG Heuer */}
      <BrandCarousel 
        brand="TAG Heuer" 
        title="Coleção TAG Heuer" 
        description="Esporte e elegância unidos na perfeição" 
      />
      
      {/* Ofertas */}
      <OffersCarousel />
      
      {/* Novidades e Limitados */}
      <NewProductsCarousel />
      
      {/* Seção Institucional */}
      <AboutSection />
    </div>
  );
};

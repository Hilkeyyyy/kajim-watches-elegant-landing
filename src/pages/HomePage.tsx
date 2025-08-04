
import React from 'react';
import { Header } from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import BrandsCarousel from '@/components/BrandsCarousel';
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
      
      {/* Categorias */}
      <CategoryCarousel />
      
      {/* Produtos em Destaque */}
      <FeaturedCarousel />
      
      {/* Ofertas */}
      <OffersCarousel />
      
      {/* Novidades e Limitados */}
      <NewProductsCarousel />
      
      {/* Carrossel de Marcas */}
      <BrandsCarousel />
      
      {/* Seção Institucional */}
      <AboutSection />
    </div>
  );
};

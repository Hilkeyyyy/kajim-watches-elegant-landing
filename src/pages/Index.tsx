import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryCarousel />
      <ProductsSection />
      <AboutSection />
    </div>
  );
};

export default Index;

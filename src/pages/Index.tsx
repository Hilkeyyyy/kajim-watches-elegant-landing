import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { OffersCarousel } from "@/components/carousels/OffersCarousel";
import { NewProductsCarousel } from "@/components/carousels/NewProductsCarousel";
import { OutOfStockCarousel } from "@/components/carousels/OutOfStockCarousel";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryCarousel />
      <OffersCarousel />
      <NewProductsCarousel />
      <OutOfStockCarousel />
      <ProductsSection />
      <AboutSection />
    </div>
  );
};

export default Index;

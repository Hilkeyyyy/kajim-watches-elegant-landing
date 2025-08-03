import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { OffersCarousel } from "@/components/carousels/OffersCarousel";
import { NewProductsCarousel } from "@/components/carousels/NewProductsCarousel";
import { FeaturedCarousel } from "@/components/carousels/FeaturedCarousel";
import { OutOfStockCarousel } from "@/components/carousels/OutOfStockCarousel";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import { CartDebugger } from "@/components/CartDebugger";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryCarousel />
      <OffersCarousel />
      <FeaturedCarousel />
      <NewProductsCarousel />
      <OutOfStockCarousel />
      <ProductsSection />
      <AboutSection />
      <CartDebugger />
    </div>
  );
};

export default Index;

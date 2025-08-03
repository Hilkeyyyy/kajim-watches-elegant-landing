import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import { OffersCarousel } from "@/components/carousels/OffersCarousel";
import { NewProductsCarousel } from "@/components/carousels/NewProductsCarousel";
import { FeaturedCarousel } from "@/components/carousels/FeaturedCarousel";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <BrandsCarousel />
      <OffersCarousel />
      <FeaturedCarousel />
      <NewProductsCarousel />
      <AboutSection />
    </div>
  );
};

export default Index;

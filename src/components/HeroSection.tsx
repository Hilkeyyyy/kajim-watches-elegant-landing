import { Button } from "@/components/ui/Button";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden px-4 py-12">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background"></div>
      
      {/* Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-foreground mb-2 tracking-[0.02em] leading-tight">
            RELÓGIOS
          </h1>
          <h2 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground tracking-[0.05em] leading-none">
            KAJIM
          </h2>
        </div>
        
        {/* Subtitle */}
        <p className="font-inter text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 tracking-wide font-light">
          Precisão. Estilo. Exclusividade.
        </p>
        
        {/* CTA Button */}
        <Button 
          size="lg"
          onClick={scrollToProducts}
          className="bg-foreground text-background hover:bg-foreground/90 font-inter font-medium tracking-wide px-8 py-4 text-base transition-all duration-300 hover:scale-105"
        >
          Explorar Coleção
        </Button>
      </div>
      
      {/* Hero Image */}
      <div className="relative z-10 mt-16 w-full max-w-md mx-auto">
        <div className="relative">
          <img 
            src={heroWatch} 
            alt="KAJIM Luxury Watch" 
            className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
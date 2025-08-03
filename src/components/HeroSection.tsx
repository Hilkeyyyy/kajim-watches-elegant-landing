import { Button } from "@/components/ui/Button";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 bg-gradient-hero relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={heroWatch} 
          alt="KAJIM Watch" 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-[90vw] sm:max-w-lg mx-auto">
        {/* Brand Name */}
        <h1 className="font-playfair text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-3 sm:mb-4 tracking-wider leading-tight">
          KAJIM
          <br />
          <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-[0.2em]">
            WATCHES
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="font-inter text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground mb-6 xs:mb-8 sm:mb-12 tracking-wide font-light px-2">
          Precisão. Estilo. Exclusividade.
        </p>
        
        {/* CTA Button */}
        <Button 
          variant="primary" 
          size="lg"
          onClick={scrollToProducts}
          className="font-inter font-medium tracking-wide hover:scale-105 transition-all duration-300 text-sm sm:text-base w-auto min-w-[200px]"
        >
          Explorar Coleção
        </Button>
      </div>
      
      {/* Hero Image */}
      <div className="mt-6 xs:mt-8 sm:mt-16 w-full max-w-[280px] xs:max-w-xs sm:max-w-sm mx-auto px-4">
        <img 
          src={heroWatch} 
          alt="KAJIM Luxury Watch" 
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>
    </section>
  );
};

export default HeroSection;
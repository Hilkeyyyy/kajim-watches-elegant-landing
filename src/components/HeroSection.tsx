import { Button } from "@/components/ui/button";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-gradient-hero relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={heroWatch} 
          alt="KAJIM Watch" 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Brand Name */}
        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 tracking-wider leading-tight">
          KAJIM
          <br />
          <span className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[0.2em]">
            WATCHES
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="font-inter text-lg md:text-xl text-muted-foreground mb-12 tracking-wide font-light">
          Precisão. Estilo. Exclusividade.
        </p>
        
        {/* CTA Button */}
        <Button 
          variant="luxury" 
          size="xl"
          onClick={scrollToProducts}
          className="font-inter font-medium tracking-wide hover:scale-105 transition-all duration-300"
        >
          Explorar Coleção
        </Button>
      </div>
      
      {/* Hero Image */}
      <div className="mt-16 w-full max-w-sm mx-auto">
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
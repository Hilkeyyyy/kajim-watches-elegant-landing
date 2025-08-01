import watchDetails from "@/assets/watch-details.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 px-6 bg-accent text-accent-foreground">
      <div className="max-w-md mx-auto text-center">
        {/* Brand Story */}
        <div className="mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-8 text-accent-foreground">
            KAJIM WATCHES
          </h2>
          
          <p className="font-inter text-lg md:text-xl leading-relaxed font-light text-accent-foreground/90 mb-8">
            KAJIM WATCHES é a combinação entre precisão, elegância e acessibilidade. 
            Clones premium A++ com garantia.
          </p>
          
          <p className="font-inter text-base leading-relaxed font-light text-accent-foreground/80">
            Cada peça é cuidadosamente selecionada para oferecer a você 
            a experiência de luxo que merece, sem comprometer a qualidade 
            ou o seu orçamento.
          </p>
        </div>
        
        {/* Detail Image */}
        <div className="w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-elegant">
          <img 
            src={watchDetails} 
            alt="Detalhes KAJIM Watch" 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Quality Features */}
        <div className="mt-12 grid grid-cols-1 gap-6">
          <div className="text-center">
            <h3 className="font-playfair text-xl font-semibold mb-2 text-accent-foreground">
              Qualidade A++
            </h3>
            <p className="font-inter text-sm text-accent-foreground/80 font-light">
              Movimentos de alta precisão
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="font-playfair text-xl font-semibold mb-2 text-accent-foreground">
              Garantia
            </h3>
            <p className="font-inter text-sm text-accent-foreground/80 font-light">
              Proteção completa da sua compra
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="font-playfair text-xl font-semibold mb-2 text-accent-foreground">
              Entrega Segura
            </h3>
            <p className="font-inter text-sm text-accent-foreground/80 font-light">
              Envio discreto para todo Brasil
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
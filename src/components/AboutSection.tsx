import watchDetails from "@/assets/watch-details.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-8 tracking-wide">
              RELÓGIOS KAJIM
            </h2>
            
            <div className="space-y-6 mb-12">
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. 
                Relógios 100% originais com garantia.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Cada peça é cuidadosamente selecionada para oferecer a você a experiência 
                de luxo que merece, sem comprometer a qualidade ou o seu orçamento.
              </p>
            </div>

            {/* Quality Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-white">A++</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-2">
                  Qualidade A++
                </h3>
                <p className="text-gray-300 text-sm">
                  Movimentos de alta precisão
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-2">
                  Garantia
                </h3>
                <p className="text-gray-300 text-sm">
                  Suporte completo e confiável
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
              <img 
                src={watchDetails} 
                alt="KAJIM Luxury Watch Details" 
                className="relative w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
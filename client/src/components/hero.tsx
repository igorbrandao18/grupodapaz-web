import { Phone, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import image1 from "@assets/stock_images/funeral_home_memoria_8d14bad3.jpg";
import image2 from "@assets/stock_images/funeral_home_memoria_537515fc.jpg";
import image3 from "@assets/stock_images/funeral_home_memoria_73d4fc1e.jpg";
import image4 from "@assets/stock_images/funeral_home_memoria_3c12273a.jpg";
import image5 from "@assets/stock_images/funeral_home_memoria_bd2300aa.jpg";

const images = [image1, image2, image3, image4, image5];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById("contato");
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById("servicos");
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section id="inicio" className="pt-20" data-testid="section-hero">
        <div className="relative h-[600px] md:h-[700px] overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              role="img"
              aria-label={`Imagem ${index + 1} do carrossel - Serviços funerários do Grupo da Paz`}
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" data-testid="text-hero-title">
                Proteção que Conforta
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-4 font-light" data-testid="text-hero-subtitle">
                Cuidamos da sua família com carinho, respeito e excelência. 15 anos de experiência oferecendo proteção completa em momentos difíceis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={scrollToContact}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
                  data-testid="button-proteger-familia"
                >
                  Proteger Minha Família
                </button>
                <button
                  onClick={scrollToServices}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg hover:bg-white/20 transition-colors font-semibold text-lg"
                  data-testid="button-como-funciona"
                >
                  Ver Como Funciona
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2" data-testid="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                }`}
                data-testid={`carousel-indicator-${index}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-12" data-testid="section-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-years">
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-sm md:text-base opacity-90">Anos de Experiência</div>
            </div>
            <div data-testid="stat-families">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-sm md:text-base opacity-90">Famílias Protegidas</div>
            </div>
            <div data-testid="stat-units">
              <div className="text-4xl md:text-5xl font-bold mb-2">3</div>
              <div className="text-sm md:text-base opacity-90">Unidades no Ceará</div>
            </div>
            <div data-testid="stat-support">
              <div className="text-4xl md:text-5xl font-bold mb-2">24h</div>
              <div className="text-sm md:text-base opacity-90">Atendimento Contínuo</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

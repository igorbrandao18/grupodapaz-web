import { Phone } from "lucide-react";
import { FaWhatsapp, FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import image1 from "@assets/stock_images/peaceful_funeral_hom_6f5ff4f2.jpg";
import image2 from "@assets/stock_images/peaceful_funeral_hom_43f287a4.jpg";
import image3 from "@assets/stock_images/peaceful_funeral_hom_4750f98b.jpg";
import image4 from "@assets/stock_images/peaceful_funeral_hom_8d1632bc.jpg";
import image5 from "@assets/stock_images/peaceful_funeral_hom_373da676.jpg";

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

  return (
    <section id="inicio" className="pt-20" data-testid="section-hero">
      <div className="relative h-[600px] md:h-[700px] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(40, 128, 61, 0.6), rgba(40, 128, 61, 0.6)), url('${image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-6">
              <FaHeart className="text-accent text-5xl mb-4 mx-auto" data-testid="icon-heart" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
              Grupo da Paz
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-light" data-testid="text-hero-subtitle">
              Cuidando com Respeito, Carinho e Dignidade
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
              Neste momento difícil, estamos ao seu lado para oferecer apoio, conforto e os melhores serviços
              funerários com toda a dedicação que sua família merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToContact}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
                data-testid="button-atendimento-24h"
              >
                <Phone className="inline-block mr-2 h-5 w-5" />
                Atendimento 24h
              </button>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg inline-flex items-center justify-center"
                data-testid="button-whatsapp"
              >
                <FaWhatsapp className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
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
  );
}

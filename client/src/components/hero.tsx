import { Phone } from "lucide-react";
import { FaWhatsapp, FaHeart } from "react-icons/fa";

export default function Hero() {
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
      <div
        className="relative h-[600px] md:h-[700px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)), url('https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        }}
      >
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
      </div>
    </section>
  );
}

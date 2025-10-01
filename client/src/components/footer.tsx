import { FaDove, FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div data-testid="footer-company">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <FaDove className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Grupo da Paz</h3>
                <p className="text-sm opacity-80">Serviços Funerários</p>
              </div>
            </div>
            <p className="opacity-80 mb-4">
              Há mais de 30 anos cuidando de famílias com respeito, dignidade e profissionalismo.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
                data-testid="link-facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
                data-testid="link-instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
                data-testid="link-linkedin"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div data-testid="footer-quick-links">
            <h4 className="text-xl font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-link-inicio"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-link-servicos"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("depoimentos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-link-depoimentos"
                >
                  Depoimentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contato")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-link-contato"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div data-testid="footer-services">
            <h4 className="text-xl font-bold mb-6">Serviços</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-service-velorio"
                >
                  Velório
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-service-cremacao"
                >
                  Cremação
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-service-sepultamento"
                >
                  Sepultamento
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-service-floricultura"
                >
                  Floricultura
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-service-documentacao"
                >
                  Documentação
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  data-testid="footer-service-apoio"
                >
                  Apoio Familiar
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div data-testid="footer-contact">
            <h4 className="text-xl font-bold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="opacity-80 text-sm">Atendimento 24h</p>
                  <a
                    href="tel:+551140028922"
                    className="font-semibold hover:text-primary transition-colors"
                    data-testid="footer-phone"
                  >
                    (11) 4002-8922
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaWhatsapp className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="opacity-80 text-sm">WhatsApp</p>
                  <a
                    href="https://wa.me/5511999999999"
                    className="font-semibold hover:text-primary transition-colors"
                    data-testid="footer-whatsapp"
                  >
                    (11) 99999-9999
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="opacity-80 text-sm">E-mail</p>
                  <a
                    href="mailto:contato@grupodapaz.com.br"
                    className="font-semibold hover:text-primary transition-colors text-sm"
                    data-testid="footer-email"
                  >
                    contato@grupodapaz.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="opacity-80 text-sm">
                    Av. Paulista, 1000
                    <br />
                    São Paulo, SP
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Business Hours */}
        <div className="border-t border-white/20 pt-8 mb-8" data-testid="footer-hours">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">Horário de Atendimento</h4>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="font-semibold mb-1">Emergencial</p>
                <p className="opacity-80">24 horas - Todos os dias</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="font-semibold mb-1">Segunda a Sexta</p>
                <p className="opacity-80">8h às 18h</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="font-semibold mb-1">Sábados</p>
                <p className="opacity-80">9h às 14h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-white/20 pt-8" data-testid="footer-legal">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="opacity-80 text-sm">© 2024 Grupo da Paz Serviços Funerários. Todos os direitos reservados.</p>
              <p className="opacity-60 text-xs mt-1">CNPJ: 12.345.678/0001-90 | Licença Municipal: 12345</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors" data-testid="link-privacy">
                Política de Privacidade
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors" data-testid="link-terms">
                Termos de Uso
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors" data-testid="link-lgpd">
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

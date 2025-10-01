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
                <p className="text-sm opacity-80">Terra Prometida</p>
              </div>
            </div>
            <p className="opacity-80 mb-4">
              Há mais de 15 anos cuidando das famílias cearenses com carinho, respeito e excelência em todos os momentos.
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

          {/* Services */}
          <div data-testid="footer-services">
            <h4 className="text-xl font-bold mb-6">Nossos Serviços</h4>
            <ul className="space-y-3">
              <li className="opacity-80">Proteção Funeral Completa</li>
              <li className="opacity-80">Assistência Familiar</li>
              <li className="opacity-80">Plano Familiar</li>
              <li className="opacity-80">Atendimento 24h</li>
              <li className="opacity-80">Transporte Incluso</li>
            </ul>
          </div>

          {/* Units */}
          <div data-testid="footer-units">
            <h4 className="text-xl font-bold mb-6">Nossas Unidades</h4>
            <ul className="space-y-4">
              <li>
                <p className="font-semibold">Fortaleza</p>
                <p className="text-sm opacity-80">Av. Beira Mar, 1234</p>
                <p className="text-sm opacity-80">(85) 3456-7890</p>
              </li>
              <li>
                <p className="font-semibold">Sobral</p>
                <p className="text-sm opacity-80">Rua da Paz, 567</p>
                <p className="text-sm opacity-80">(88) 2345-6789</p>
              </li>
              <li>
                <p className="font-semibold">Juazeiro do Norte</p>
                <p className="text-sm opacity-80">Av. São Francisco, 890</p>
                <p className="text-sm opacity-80">(88) 1234-5678</p>
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
                  <p className="opacity-80 text-sm">Telefone 24h</p>
                  <a
                    href="tel:+558534567890"
                    className="font-semibold hover:text-primary transition-colors"
                    data-testid="footer-phone"
                  >
                    (85) 3456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaWhatsapp className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="opacity-80 text-sm">WhatsApp</p>
                  <a
                    href="https://wa.me/5585987654321"
                    className="font-semibold hover:text-primary transition-colors"
                    data-testid="footer-whatsapp"
                  >
                    (85) 9 8765-4321
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
            </ul>
          </div>
        </div>


        {/* Legal */}
        <div className="border-t border-white/20 pt-8" data-testid="footer-legal">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="opacity-80 text-sm">© 2024 Grupo da Paz - Terra Prometida. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors" data-testid="link-privacy">
                Política de Privacidade
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors" data-testid="link-terms">
                Termos de Uso
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors" data-testid="link-contract">
                Contrato
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

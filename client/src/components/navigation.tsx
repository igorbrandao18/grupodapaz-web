import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/image_1759342528663.png";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Grupo da Paz Logo" 
              className="h-12 w-12 md:h-16 md:w-16 object-contain" 
              data-testid="logo-icon"
            />
            <div>
              <h1 className="text-2xl font-bold text-secondary" data-testid="company-name">Grupo da Paz</h1>
              <p className="text-xs text-muted-foreground">Serviços Funerários</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-link-inicio"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-link-servicos"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-link-depoimentos"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-link-contato"
            >
              Contato
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection("contato")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-sm"
              data-testid="button-cta-desktop"
            >
              Fale Conosco
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection("inicio")}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium py-2"
              data-testid="mobile-nav-link-inicio"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium py-2"
              data-testid="mobile-nav-link-servicos"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium py-2"
              data-testid="mobile-nav-link-depoimentos"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium py-2"
              data-testid="mobile-nav-link-contato"
            >
              Contato
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-center font-semibold mt-4"
              data-testid="button-cta-mobile"
            >
              Fale Conosco
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

import logoImage from "@assets/image_1759342528663.png";

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-primary shadow-md z-50" data-testid="navigation">
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
              <h1 className="text-2xl font-bold text-primary-foreground" data-testid="company-name">Grupo da Paz</h1>
              <p className="text-xs text-primary-foreground/80">Serviços Funerários</p>
            </div>
          </div>

          {/* Portal do Cliente Button */}
          <div>
            <button
              className="bg-primary-foreground text-primary px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors font-semibold shadow-sm"
              data-testid="button-portal-cliente"
            >
              Portal do Cliente
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
}

import { Home, Flame, Cross, Flower, FileText, HandHeart } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Home className="text-3xl" />,
      title: "Velório",
      description:
        "Salas de velório confortáveis e acolhedoras, com toda infraestrutura necessária para receber familiares e amigos com dignidade.",
      features: ["Ambientes climatizados", "Estacionamento privativo", "Serviço de café e apoio"],
      testId: "service-velorio",
    },
    {
      icon: <Flame className="text-3xl" />,
      title: "Cremação",
      description:
        "Serviços completos de cremação com todo respeito e seguindo todos os protocolos legais e éticos estabelecidos.",
      features: ["Crematório próprio", "Urnas personalizadas", "Acompanhamento da família"],
      testId: "service-cremacao",
    },
    {
      icon: <Cross className="text-3xl" />,
      title: "Sepultamento",
      description:
        "Organização completa do sepultamento, incluindo documentação, transporte e coordenação com cemitérios.",
      features: ["Documentação completa", "Transporte especializado", "Coordenação geral"],
      testId: "service-sepultamento",
    },
    {
      icon: <Flower className="text-3xl" />,
      title: "Floricultura",
      description: "Arranjos florais personalizados para homenagear seu ente querido com beleza e delicadeza.",
      features: ["Coroas e arranjos", "Flores naturais frescas", "Entrega no local"],
      testId: "service-floricultura",
    },
    {
      icon: <FileText className="text-3xl" />,
      title: "Documentação",
      description: "Cuidamos de toda a burocracia e documentação necessária, facilitando este momento para a família.",
      features: ["Certidões e registros", "Auxílio com seguros", "Orientação completa"],
      testId: "service-documentacao",
    },
    {
      icon: <HandHeart className="text-3xl" />,
      title: "Apoio Familiar",
      description: "Equipe especializada em oferecer suporte emocional e prático para toda a família neste momento.",
      features: ["Atendimento humanizado", "Orientação em luto", "Disponibilidade 24h"],
      testId: "service-apoio",
    },
  ];

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
    <section id="servicos" className="py-20 bg-muted" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4" data-testid="text-services-title">
            Nossos Serviços
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-description">
            Oferecemos uma gama completa de serviços funerários, cuidando de cada etapa com profissionalismo e empatia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              data-testid={service.testId}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4" data-testid={`text-${service.testId}-title`}>
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6" data-testid={`text-${service.testId}-description`}>
                {service.description}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start" data-testid={`feature-${service.testId}-${featureIndex}`}>
                    <svg className="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-secondary text-secondary-foreground rounded-2xl p-12 text-center shadow-xl" data-testid="cta-custom-plans">
          <h3 className="text-3xl font-bold mb-4" data-testid="text-custom-plans-title">Planos Personalizados</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90" data-testid="text-custom-plans-description">
            Cada família é única e merece um atendimento personalizado. Entre em contato para conhecer nossas opções e
            escolher o que melhor atende às suas necessidades.
          </p>
          <button
            onClick={scrollToContact}
            className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg shadow-lg"
            data-testid="button-solicitar-orcamento"
          >
            Solicitar Orçamento
          </button>
        </div>
      </div>
    </section>
  );
}

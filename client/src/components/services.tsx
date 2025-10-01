import { Shield, Users, Home, Clock, Check } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Proteção Funeral Completa",
      description: "Cobertura completa para cerimônias fúnebres com dignidade e respeito",
      features: ["Velório 24h", "Cremação", "Sepultamento", "Transporte"]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Assistência Familiar",
      description: "Suporte emocional e prático para toda a família durante momentos difíceis",
      features: ["Aconselhamento", "Suporte psicológico", "Assistência jurídica", "Benefícios"]
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: "Plano Familiar",
      description: "Proteção para toda a família com condições especiais e descontos",
      features: ["Até 6 dependentes", "Desconto progressivo", "Cobertura ampliada", "Renovação automática"]
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Atendimento 24h",
      description: "Disponibilidade total para emergências e necessidades urgentes",
      features: ["Emergência 24h", "Atendimento telefônico", "Suporte online", "Resposta rápida"]
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-white" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços para cuidar de você e sua família
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-muted rounded-xl p-6" data-testid={`service-${index}`}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 text-sm">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Shield, Clock, Users, Heart } from "lucide-react";

export default function WhyChoose() {
  const reasons = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Proteção Completa",
      description: "Cobertura total para você e sua família em momentos difíceis"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Atendimento 24h",
      description: "Suporte disponível a qualquer hora do dia ou da noite"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Equipe Especializada",
      description: "Profissionais treinados para oferecer cuidado e respeito"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Atendimento Humanizado",
      description: "Tratamento personalizado com carinho e compreensão"
    }
  ];

  return (
    <section className="py-20 bg-white" data-testid="section-why-choose">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Por que escolher o Grupo da Paz?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos proteção completa com atendimento humanizado e tecnologia de ponta
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center p-6" data-testid={`why-reason-${index}`}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

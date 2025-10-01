import { Clock, Award, Heart, Shield } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <Clock className="text-3xl" />,
      title: "Atendimento 24 Horas",
      description: "Estamos disponíveis a qualquer hora do dia ou da noite para atender sua família",
      testId: "reason-24h",
    },
    {
      icon: <Award className="text-3xl" />,
      title: "Experiência e Tradição",
      description: "Mais de três décadas servindo famílias com dedicação e profissionalismo",
      testId: "reason-experiencia",
    },
    {
      icon: <Heart className="text-3xl" />,
      title: "Atendimento Humanizado",
      description: "Equipe treinada para oferecer acolhimento e empatia em todos os momentos",
      testId: "reason-humanizado",
    },
    {
      icon: <Shield className="text-3xl" />,
      title: "Transparência Total",
      description: "Orçamentos claros e honestos, sem surpresas ou custos ocultos",
      testId: "reason-transparencia",
    },
  ];

  return (
    <section className="py-20 bg-white" data-testid="section-why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4" data-testid="text-why-title">
            Por Que Escolher o Grupo da Paz?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-why-description">
            Nosso compromisso é oferecer tranquilidade e suporte em um dos momentos mais difíceis
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center" data-testid={reason.testId}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3" data-testid={`text-${reason.testId}-title`}>
                {reason.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`text-${reason.testId}-description`}>
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

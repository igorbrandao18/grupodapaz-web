import { Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      text: "O Grupo da Paz me deu tranquilidade em um momento muito difícil. O atendimento foi excepcional e todo o processo foi conduzido com muito respeito e carinho.",
      name: "Maria Silva",
      plan: "Cliente Premium",
      initials: "MS",
      testId: "testimonial-1",
    },
    {
      text: "Recomendo de olhos fechados. A equipe é muito profissional e o serviço é completo. Vale cada centavo investido na proteção da família.",
      name: "João Santos",
      plan: "Cliente Essencial",
      initials: "JS",
      testId: "testimonial-2",
    },
    {
      text: "Foi uma escolha acertada contratar o Grupo da Paz. O atendimento 24h é real e a qualidade do serviço superou minhas expectativas.",
      name: "Ana Costa",
      plan: "Cliente Básico",
      initials: "AC",
      testId: "testimonial-3",
    },
  ];

  return (
    <section id="depoimentos" className="py-20 bg-white" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-testimonials-title">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-testimonials-description">
            Histórias reais de famílias que encontraram conforto e proteção conosco
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-lg p-8"
              data-testid={testimonial.testId}
            >
              <Quote className="text-primary w-10 h-10 mb-4" />
              <p className="text-muted-foreground mb-6 italic" data-testid={`text-${testimonial.testId}-content`}>
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-4">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-bold" data-testid={`text-${testimonial.testId}-name`}>{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-${testimonial.testId}-plan`}>{testimonial.plan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

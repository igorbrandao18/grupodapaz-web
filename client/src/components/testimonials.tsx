import { User, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Maria Silva",
      location: "São Paulo, SP",
      text: "Em um momento tão difícil, o Grupo da Paz nos acolheu com tanto carinho e profissionalismo. Cuidaram de tudo com respeito e dignidade. Somos eternamente gratos.",
      testId: "testimonial-1",
    },
    {
      name: "João Santos",
      location: "Campinas, SP",
      text: "A equipe foi extremamente atenciosa e cuidadosa. Facilitaram toda a burocracia e nos permitiram focar no que realmente importava: estar com nossa família. Recomendo de coração.",
      testId: "testimonial-2",
    },
    {
      name: "Ana Costa",
      location: "Santos, SP",
      text: "Não tenho palavras para agradecer todo o suporte e carinho que recebemos. O Grupo da Paz honrou a memória do nosso pai com toda a dignidade que ele merecia. Muito obrigada.",
      testId: "testimonial-3",
    },
  ];

  return (
    <section id="depoimentos" className="py-20 bg-gradient-to-b from-muted to-white" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4" data-testid="text-testimonials-title">
            Mensagens de Conforto
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-testimonials-description">
            Palavras de famílias que confiaram em nossos serviços neste momento delicado
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              data-testid={testimonial.testId}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <User className="text-primary text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-card-foreground" data-testid={`text-${testimonial.testId}-name`}>
                    {testimonial.name}
                  </h4>
                  <div className="flex text-accent">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground italic mb-4" data-testid={`text-${testimonial.testId}-content`}>
                "{testimonial.text}"
              </p>
              <p className="text-sm text-muted-foreground" data-testid={`text-${testimonial.testId}-location`}>
                {testimonial.location}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto text-center bg-card rounded-2xl p-12 shadow-xl" data-testid="comfort-quote">
          <Quote className="text-accent text-4xl mb-6 mx-auto" />
          <p className="text-2xl text-card-foreground font-serif italic mb-6" data-testid="text-quote">
            "A morte não é nada. Eu apenas deslizei para o próximo quarto. Eu sou eu, você é você. O que éramos um para
            o outro, ainda somos."
          </p>
          <p className="text-muted-foreground font-semibold" data-testid="text-quote-author">— Henry Scott Holland</p>
        </div>
      </div>
    </section>
  );
}

import { Check } from "lucide-react";

export default function About() {
  return (
    <section className="py-20 bg-white" data-testid="section-about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6" data-testid="text-about-title">
              Mais de 30 Anos de Experiência e Dedicação
            </h2>
            <p className="text-lg text-muted-foreground mb-6" data-testid="text-about-p1">
              O Grupo da Paz nasceu com a missão de oferecer serviços funerários completos e humanizados, respeitando
              cada história e honrando cada memória. Entendemos que este é um momento delicado e estamos preparados para
              cuidar de todos os detalhes com sensibilidade e profissionalismo.
            </p>
            <p className="text-lg text-muted-foreground mb-6" data-testid="text-about-p2">
              Nossa equipe está disponível 24 horas por dia, 7 dias por semana, para atender sua família com o respeito
              e a atenção que vocês merecem. Trabalhamos com transparência, ética e compromisso total.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center" data-testid="stat-anos">
                <div className="text-4xl font-bold text-primary mb-2">30+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center" data-testid="stat-atendimento">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Atendimento</div>
              </div>
              <div className="text-center" data-testid="stat-familias">
                <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                <div className="text-sm text-muted-foreground">Famílias Atendidas</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Interior acolhedor da capela"
              className="rounded-2xl shadow-2xl w-full h-auto"
              data-testid="img-chapel"
            />
            <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg max-w-xs" data-testid="quote-box">
              <p className="font-semibold text-lg">"Com respeito e dignidade em cada detalhe"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

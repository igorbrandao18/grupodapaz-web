import { Check } from "lucide-react";

export default function Plans() {
  const plans = [
    {
      name: "Plano Básico",
      price: "R$ 89,90",
      period: "/mês",
      features: [
        "Cobertura individual",
        "Velório 24h",
        "Sepultamento",
        "Transporte local",
        "Assistência documental"
      ]
    },
    {
      name: "Plano Essencial",
      price: "R$ 149,90",
      period: "/mês",
      popular: true,
      features: [
        "Até 3 dependentes",
        "Velório premium",
        "Cremação ou sepultamento",
        "Transporte estadual",
        "Floricultura inclusa",
        "Assistência psicológica"
      ]
    },
    {
      name: "Plano Premium",
      price: "R$ 249,90",
      period: "/mês",
      features: [
        "Até 6 dependentes",
        "Velório VIP",
        "Cremação e sepultamento",
        "Transporte nacional",
        "Floricultura premium",
        "Assistência jurídica",
        "Cerimônia personalizada",
        "Memorial digital"
      ]
    }
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
    <section className="py-20 bg-muted" data-testid="section-plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Planos de Proteção
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para proteger você e sua família com tranquilidade e segurança
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-4 ring-primary transform scale-105' : ''
              }`}
              data-testid={`plan-${index}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold">
                  Mais Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToContact}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
                data-testid={`button-contratar-${index}`}
              >
                Contratar Plano
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8">
          *Valores promocionais. Parcelamento em até 12x sem juros no cartão.
        </p>
      </div>
    </section>
  );
}

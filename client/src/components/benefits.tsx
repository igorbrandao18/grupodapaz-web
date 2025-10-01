import { CreditCard, Truck, Sparkles, Church } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: <CreditCard className="w-10 h-10" />,
      title: "Pagamento Facilitado",
      description: "Parcelamento em até 12x sem juros no cartão"
    },
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Transporte Incluso",
      description: "Serviço de transporte em toda região metropolitana"
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: "Cerimônia Personalizada",
      description: "Organização completa da cerimônia conforme suas preferências"
    },
    {
      icon: <Church className="w-10 h-10" />,
      title: "Assistência Religiosa",
      description: "Suporte para cerimônias de diferentes religiões"
    }
  ];

  return (
    <section className="py-20 bg-white" data-testid="section-benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Benefícios Exclusivos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vantagens que fazem a diferença na sua experiência conosco
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center" data-testid={`benefit-${index}`}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

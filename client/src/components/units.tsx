import { MapPin, Phone, Check } from "lucide-react";

export default function Units() {
  const units = [
    {
      name: "Unidade Fortaleza",
      address: "Av. Beira Mar, 1234 - Fortaleza/CE",
      phone: "(85) 3456-7890",
      services: ["Velório", "Cremação", "Sepultamento", "Memorial"]
    },
    {
      name: "Unidade Sobral",
      address: "Rua da Paz, 567 - Sobral/CE",
      phone: "(88) 2345-6789",
      services: ["Velório", "Cremação", "Sepultamento"]
    },
    {
      name: "Unidade Juazeiro",
      address: "Av. São Francisco, 890 - Juazeiro do Norte/CE",
      phone: "(88) 1234-5678",
      services: ["Velório", "Sepultamento", "Memorial"]
    }
  ];

  return (
    <section className="py-20 bg-muted" data-testid="section-units">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossas Unidades
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos presentes em todo o Ceará para melhor atendê-lo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {units.map((unit, index) => (
            <div key={index} className="bg-card rounded-xl shadow-lg p-6" data-testid={`unit-${index}`}>
              <h3 className="text-2xl font-bold mb-4">{unit.name}</h3>
              
              <div className="flex items-start mb-4 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-1" />
                <span>{unit.address}</span>
              </div>

              <div className="flex items-center mb-6 text-primary font-semibold">
                <Phone className="w-5 h-5 mr-2" />
                <a href={`tel:${unit.phone.replace(/\D/g, '')}`}>{unit.phone}</a>
              </div>

              <div className="mb-6">
                <p className="font-semibold mb-3">Serviços disponíveis:</p>
                <ul className="space-y-2">
                  {unit.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-center text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mr-2" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Ver no Mapa
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

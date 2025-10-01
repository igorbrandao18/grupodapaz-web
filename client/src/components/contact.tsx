import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const contactMethods = [
    {
      icon: <Phone className="w-10 h-10" />,
      title: "Telefone",
      subtitle: "Atendimento 24h",
      value: "(85) 3456-7890",
      link: "tel:+558534567890",
      action: "Ligar Agora"
    },
    {
      icon: <FaWhatsapp className="w-10 h-10" />,
      title: "WhatsApp",
      subtitle: "Chat direto",
      value: "(85) 9 8765-4321",
      link: "https://wa.me/5585987654321",
      action: "Conversar"
    },
    {
      icon: <Mail className="w-10 h-10" />,
      title: "Email",
      subtitle: "Suporte por email",
      value: "contato@grupodapaz.com.br",
      link: "mailto:contato@grupodapaz.com.br",
      action: "Enviar Email"
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: "Visite-nos",
      subtitle: "Unidades físicas",
      value: "3 unidades no Ceará",
      link: "#unidades",
      action: "Ver Localizações"
    }
  ];

  return (
    <section id="contato" className="py-20 bg-muted" data-testid="section-contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos aqui para ajudar você a encontrar a melhor solução
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-card rounded-xl shadow-lg p-6 text-center" data-testid={`contact-method-${index}`}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{method.subtitle}</p>
              <p className="font-semibold text-primary mb-4">{method.value}</p>
              <a
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : undefined}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
              >
                {method.action}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

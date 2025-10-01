import { useState } from "react";
import { Phone, Mail, MapPin, Clock, AlertCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success toast
    toast({
      title: "Mensagem enviada!",
      description: "Obrigado pela sua mensagem! Entraremos em contato em breve.",
    });

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contato" className="py-20 bg-white" data-testid="section-contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4" data-testid="text-contact-title">
            Entre em Contato
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-description">
            Estamos disponíveis 24 horas por dia para atender você e sua família
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start space-x-4" data-testid="contact-phone">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Telefone 24 Horas</h3>
                  <p className="text-muted-foreground mb-2">Atendimento imediato a qualquer momento</p>
                  <a
                    href="tel:+551140028922"
                    className="text-primary font-semibold text-lg hover:underline"
                    data-testid="link-phone"
                  >
                    (11) 4002-8922
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start space-x-4" data-testid="contact-whatsapp">
                <div className="w-14 h-14 bg-green-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">WhatsApp</h3>
                  <p className="text-muted-foreground mb-2">Tire suas dúvidas ou solicite atendimento</p>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-semibold text-lg hover:underline"
                    data-testid="link-whatsapp"
                  >
                    (11) 99999-9999
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4" data-testid="contact-email">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">E-mail</h3>
                  <p className="text-muted-foreground mb-2">Para informações e orçamentos</p>
                  <a
                    href="mailto:contato@grupodapaz.com.br"
                    className="text-primary font-semibold text-lg hover:underline"
                    data-testid="link-email"
                  >
                    contato@grupodapaz.com.br
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4" data-testid="contact-address">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Endereço</h3>
                  <p className="text-muted-foreground mb-2">
                    Av. Paulista, 1000 - Bela Vista
                    <br />
                    São Paulo, SP - CEP 01310-100
                  </p>
                  <a href="#" className="text-primary font-semibold hover:underline" data-testid="link-map">
                    Ver no mapa →
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-muted rounded-xl p-6 mt-8" data-testid="business-hours">
                <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center">
                  <Clock className="text-primary mr-3" />
                  Horário de Atendimento
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Atendimento Emergencial:</span>
                    <span className="font-semibold text-primary">24 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Administrativo:</span>
                    <span className="font-semibold">Seg-Sex: 8h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados:</span>
                    <span className="font-semibold">9h às 14h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl shadow-xl p-8" data-testid="contact-form">
            <h3 className="text-2xl font-bold text-card-foreground mb-6">Envie uma Mensagem</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-card-foreground mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Digite seu nome"
                  data-testid="input-name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-card-foreground mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    placeholder="(11) 99999-9999"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-card-foreground mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    placeholder="seu@email.com"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-card-foreground mb-2">
                  Assunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  data-testid="select-subject"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="orcamento">Solicitar Orçamento</option>
                  <option value="informacoes">Informações Gerais</option>
                  <option value="emergencia">Atendimento Emergencial</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-card-foreground mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                  placeholder="Como podemos ajudar você?"
                  data-testid="textarea-message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
                data-testid="button-submit-form"
              >
                <Mail className="inline-block mr-2 h-5 w-5" />
                Enviar Mensagem
              </button>

              <p className="text-sm text-muted-foreground text-center">* Campos obrigatórios. Responderemos em breve.</p>
            </form>
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl p-8 md:p-12 text-center shadow-2xl" data-testid="emergency-banner">
          <AlertCircle className="text-5xl mb-4 mx-auto" />
          <h3 className="text-3xl font-bold mb-4">Precisa de Atendimento Imediato?</h3>
          <p className="text-xl mb-8 opacity-90">Nossa equipe está disponível 24 horas por dia, 7 dias por semana</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+551140028922"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg hover:bg-white/90 transition-colors font-bold text-lg shadow-lg"
              data-testid="button-emergency-phone"
            >
              <Phone className="inline-block mr-2 h-5 w-5" />
              (11) 4002-8922
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-lg"
              data-testid="button-emergency-whatsapp"
            >
              <FaWhatsapp className="inline-block mr-2 h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

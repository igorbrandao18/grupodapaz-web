import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Como funciona o plano de proteção funeral?",
      answer: "Nosso plano de proteção funciona como um seguro mensal que garante cobertura completa para serviços funerários. Ao contratar, você e seus dependentes ficam protegidos 24h por dia."
    },
    {
      question: "Posso incluir dependentes no plano?",
      answer: "Sim! Dependendo do plano escolhido, você pode incluir até 6 dependentes (cônjuge, filhos, pais). Consulte os detalhes de cada plano."
    },
    {
      question: "O atendimento é realmente 24 horas?",
      answer: "Sim, nossa equipe está disponível 24 horas por dia, 7 dias por semana, incluindo fins de semana e feriados para atendimento emergencial."
    },
    {
      question: "Quais documentos são necessários para contratação?",
      answer: "Você precisará de RG, CPF e comprovante de residência. Para dependentes, também são necessários os documentos de identificação de cada um."
    },
    {
      question: "Existe período de carência?",
      answer: "Sim, temos um período de carência de 30 dias para morte natural. Para morte acidental não há carência. Consulte as condições específicas do seu plano."
    },
    {
      question: "Posso cancelar o plano a qualquer momento?",
      answer: "Sim, você pode cancelar seu plano a qualquer momento sem multa. Basta entrar em contato conosco com 30 dias de antecedência."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "Aceitamos pagamento mensal via cartão de crédito, débito automático ou boleto bancário. Também oferecemos desconto para pagamento anual."
    },
    {
      question: "O plano cobre cremação e sepultamento?",
      answer: "Sim, nossos planos cobrem tanto cremação quanto sepultamento. Alguns planos premium oferecem ambas as opções."
    },
    {
      question: "Posso alterar o plano depois de contratar?",
      answer: "Sim, você pode fazer upgrade do seu plano a qualquer momento. Para downgrade, existe um período de 6 meses de permanência."
    },
    {
      question: "O transporte está incluído?",
      answer: "Sim, todos os nossos planos incluem transporte. A cobertura geográfica varia conforme o plano contratado."
    },
    {
      question: "Como é feito o atendimento em emergências?",
      answer: "Em caso de emergência, você liga para nosso número 24h e nossa equipe se desloca imediatamente ao local, cuidando de todos os procedimentos necessários."
    },
    {
      question: "Existe assistência psicológica?",
      answer: "Sim, nossos planos Essencial e Premium incluem assistência psicológica para a família durante o período de luto."
    },
    {
      question: "Posso usar o plano em qualquer cidade?",
      answer: "Sim, nossos planos têm cobertura nacional. O Plano Básico cobre a região metropolitana, enquanto Premium tem cobertura em todo território nacional."
    },
    {
      question: "Como funciona a renovação do plano?",
      answer: "A renovação é automática mediante pagamento mensal. Você não precisa se preocupar com renovações manuais."
    },
    {
      question: "Existe desconto para pagamento anual?",
      answer: "Sim, oferecemos 15% de desconto para pagamento anual à vista. Consulte nossa equipe para mais detalhes."
    },
    {
      question: "O plano cobre cerimônias religiosas?",
      answer: "Sim, respeitamos e apoiamos cerimônias de todas as religiões. Nossa equipe está preparada para atender diferentes tradições religiosas."
    }
  ];

  return (
    <section className="py-20 bg-white" data-testid="section-faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tire suas dúvidas sobre nossos serviços e planos
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-lg shadow-md overflow-hidden"
              data-testid={`faq-${index}`}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

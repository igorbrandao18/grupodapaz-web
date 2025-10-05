import { Check, Loader2, Users, CreditCard } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Plan } from "@shared/schema";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackPlanView, trackPlanClick } from "@/components/google-analytics";

export default function Plans() {
  const { data: plans, isLoading, error } = useQuery<Plan[]>({
    queryKey: ['/api/plans'],
  });
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  // Track plan views when plans are loaded
  useEffect(() => {
    if (plans && plans.length > 0) {
      plans.forEach(plan => {
        trackPlanView(plan.name, plan.price);
      });
    }
  }, [plans]);

  const checkoutMutation = useMutation({
    mutationFn: async (data: { planId: number; email: string }) => {
      const response = await apiRequest("POST", "/api/create-checkout-session", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar o checkout.",
        variant: "destructive",
      });
    },
  });

  const handleOpenCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setEmail("");
    // Track plan click for analytics
    trackPlanClick(plan.name, plan.price);
  };

  const handleCheckout = () => {
    if (!email || !selectedPlan) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
        variant: "destructive",
      });
      return;
    }

    checkoutMutation.mutate({ planId: selectedPlan.id, email });
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

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">Erro ao carregar os planos. Tente novamente mais tarde.</p>
          </div>
        )}

        {plans && plans.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card rounded-2xl shadow-lg overflow-hidden relative ${
                plan.popular ? 'ring-4 ring-primary transform scale-105' : ''
              }`}
              data-testid={`plan-${index}`}
            >
              {plan.popular && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold z-10">
                  Mais Popular
                </div>
              )}
              
              {/* Plan Cover Image */}
              {plan.image && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={plan.image} 
                    alt={`Capa ${plan.name}`}
                    className="w-full h-full object-cover"
                    data-testid={`plan-cover-${index}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {plan.description}
                    </p>
                  )}
                  
                  {plan.dependents && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>
                        {plan.dependents === 1 
                          ? '1 pessoa' 
                          : `Até ${plan.dependents} dependentes`}
                      </span>
                    </div>
                  )}
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
                  onClick={() => handleOpenCheckout(plan)}
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
            </div>
            ))}
          </div>
        )}

        {plans && plans.length === 0 && !isLoading && !error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nenhum plano disponível no momento.</p>
          </div>
        )}

        {!isLoading && !error && (
          <p className="text-center text-muted-foreground mt-8">
            *Valores promocionais. Parcelamento em até 12x sem juros no cartão.
          </p>
        )}
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-md" data-testid="dialog-checkout">
          <DialogHeader>
            <DialogTitle>Contratar {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Finalize sua assinatura com pagamento seguro via Stripe
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{selectedPlan.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-2xl font-bold text-primary">{selectedPlan.price}</span>
                  <span className="text-muted-foreground">{selectedPlan.period}</span>
                </div>

                {selectedPlan.dependents && (
                  <div className="flex items-center gap-2 pt-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {selectedPlan.dependents === 1 
                        ? '1 pessoa coberta' 
                        : `Até ${selectedPlan.dependents} dependentes`}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-email">Email *</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-checkout-email"
                />
                <p className="text-xs text-muted-foreground">
                  Você receberá a confirmação e acesso ao portal neste email
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full"
                disabled={checkoutMutation.isPending}
                data-testid="button-proceed-checkout"
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ir para Pagamento Seguro
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Pagamento processado com segurança pelo Stripe
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

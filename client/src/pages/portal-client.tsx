import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import type { Plan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Phone, Mail, CreditCard, Users } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";

function PortalClientContent() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [, setLocation] = (window as any).wouter?.useLocation?.() || [null, () => {}];

  const { data: userPlan } = useQuery<Plan | null>({
    queryKey: ['/api/plans', profile?.planId],
    queryFn: async () => {
      if (!profile?.planId) return null;
      const res = await fetch(`/api/plans/${profile.planId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!profile?.planId,
  });

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-muted">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Portal do Cliente</h1>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button variant="outline" onClick={() => (window.location.href = "/admin")}>
                Ir para Admin
              </Button>
            )}
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Seus dados cadastrais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome Completo</p>
                <p className="font-medium">{profile?.fullName || "Não informado"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Meu Plano
              </CardTitle>
              <CardDescription>Plano de proteção contratado</CardDescription>
            </CardHeader>
            <CardContent>
              {userPlan ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{userPlan.name}</h3>
                    <p className="text-2xl font-bold mt-2">
                      {userPlan.price}
                      <span className="text-sm text-muted-foreground ml-1">{userPlan.period}</span>
                    </p>
                  </div>
                  
                  {userPlan.description && (
                    <p className="text-sm text-muted-foreground">{userPlan.description}</p>
                  )}

                  {userPlan.dependents && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        {userPlan.dependents === 1 
                          ? '1 pessoa coberta' 
                          : `Até ${userPlan.dependents} dependentes`}
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Benefícios inclusos:</p>
                    <ul className="space-y-1">
                      {userPlan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Você ainda não possui um plano contratado</p>
                  <Button onClick={() => (window.location.href = "/#planos")}>
                    Ver Planos Disponíveis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Precisa de Ajuda?</CardTitle>
            <CardDescription>Entre em contato conosco</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Phone className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-medium">(85) 3456-7890</p>
                <p className="text-sm text-muted-foreground">Atendimento 24h</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Mail className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-medium">contato@grupodapaz.com</p>
                <p className="text-sm text-muted-foreground">Email</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <User className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-medium">Atendimento Presencial</p>
                <p className="text-sm text-muted-foreground">Seg-Sex: 8h-18h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PortalClient() {
  return (
    <ProtectedRoute>
      <PortalClientContent />
    </ProtectedRoute>
  );
}

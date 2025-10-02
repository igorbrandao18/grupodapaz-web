import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Plan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Phone, Mail, CreditCard, Users, FileText, Download, Plus, Trash2, CheckCircle, Heart } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDependentSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

const dependentFormSchema = insertDependentSchema.extend({
  birthDate: z.string().optional(),
});

type DependentFormData = z.infer<typeof dependentFormSchema>;

function PortalClientContent() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const [addDependentOpen, setAddDependentOpen] = useState(false);

  const { data: subscriptions, isLoading: loadingSubs } = useQuery<any[]>({
    queryKey: ['/api/subscriptions'],
  });

  const { data: dependents, isLoading: loadingDeps } = useQuery<any[]>({
    queryKey: ['/api/dependents'],
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery<any[]>({
    queryKey: ['/api/invoices'],
  });

  const form = useForm<DependentFormData>({
    resolver: zodResolver(dependentFormSchema),
    defaultValues: {
      name: "",
      cpf: "",
      relationship: "",
      birthDate: "",
      active: true,
    },
  });

  const createDependentMutation = useMutation({
    mutationFn: async (data: DependentFormData) => {
      const payload = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : null,
      };
      return apiRequest("POST", "/api/dependents", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dependents'] });
      toast({
        title: "Dependente adicionado",
        description: "O dependente foi cadastrado com sucesso.",
      });
      form.reset();
      setAddDependentOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o dependente.",
        variant: "destructive",
      });
    },
  });

  const deleteDependentMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/dependents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dependents'] });
      toast({
        title: "Dependente removido",
        description: "O dependente foi removido com sucesso.",
      });
    },
  });

  const generateCopyMutation = useMutation({
    mutationFn: (invoiceId: number) => 
      apiRequest("POST", `/api/invoices/${invoiceId}/generate-copy`).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "2ª Via Gerada",
        description: "Código PIX e Boleto disponíveis.",
      });
    },
  });

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const activeSub = subscriptions?.[0];
  const activePlan = activeSub?.plan;

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
              {activePlan ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{activePlan.name}</h3>
                    <p className="text-2xl font-bold mt-2">
                      {activePlan.price}
                      <span className="text-sm text-muted-foreground ml-1">{activePlan.period}</span>
                    </p>
                  </div>
                  
                  {activePlan.description && (
                    <p className="text-sm text-muted-foreground">{activePlan.description}</p>
                  )}

                  {activePlan.dependents && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        {activePlan.dependents === 1 
                          ? '1 pessoa coberta' 
                          : `Até ${activePlan.dependents} dependentes`}
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Benefícios inclusos:</p>
                    <ul className="space-y-1">
                      {activePlan.features.map((feature: string, index: number) => (
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

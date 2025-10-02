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
import { LogOut, User, Phone, Mail, CreditCard, Users, FileText, Download, Plus, Trash2, CheckCircle, Heart, Loader2 } from "lucide-react";
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
        <Tabs defaultValue="plan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-navigation">
            <TabsTrigger value="plan" data-testid="tab-plan">
              <Heart className="w-4 h-4 mr-2" />
              Meu Plano
            </TabsTrigger>
            <TabsTrigger value="dependents" data-testid="tab-dependents">
              <Users className="w-4 h-4 mr-2" />
              Dependentes
            </TabsTrigger>
            <TabsTrigger value="invoices" data-testid="tab-invoices">
              <FileText className="w-4 h-4 mr-2" />
              Faturas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plan" data-testid="tab-content-plan">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{profile?.full_name || "Não informado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                  {profile?.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card data-testid="card-active-plan">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Plano Ativo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activePlan ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{activePlan.name}</h3>
                        <p className="text-2xl font-bold mt-2" data-testid="text-plan-price">
                          {activePlan.price}<span className="text-sm text-muted-foreground ml-1">{activePlan.period}</span>
                        </p>
                      </div>
                      {activePlan.description && (
                        <p className="text-sm text-muted-foreground">{activePlan.description}</p>
                      )}
                      <div className="bg-muted p-3 rounded-lg">
                        <Users className="w-4 h-4 text-primary inline mr-2" />
                        <span className="text-sm" data-testid="text-plan-dependents">
                          {activePlan.dependents === 1 ? '1 pessoa' : `Até ${activePlan.dependents} dependentes`}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Benefícios:</p>
                        <ul className="space-y-1">
                          {activePlan.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm" data-testid={`feature-${idx}`}>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8" data-testid="card-no-plan">
                      <p className="text-muted-foreground mb-4">Você ainda não possui um plano contratado</p>
                      <Button onClick={() => (window.location.href = "/")} data-testid="button-view-plans">
                        Ver Planos Disponíveis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dependents" data-testid="tab-content-dependents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Meus Dependentes</CardTitle>
                  <Dialog open={addDependentOpen} onOpenChange={setAddDependentOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-dependent">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="dialog-add-dependent">
                      <DialogHeader>
                        <DialogTitle>Adicionar Dependente</DialogTitle>
                        <DialogDescription>Preencha os dados do dependente</DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit((data) => createDependentMutation.mutate(data))} className="space-y-4">
                          <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl><Input {...field} data-testid="input-dependent-name" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="cpf" render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF</FormLabel>
                              <FormControl><Input {...field} data-testid="input-dependent-cpf" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="relationship" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parentesco</FormLabel>
                              <FormControl><Input {...field} placeholder="Ex: Cônjuge, Filho(a)" data-testid="input-dependent-relationship" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="birthDate" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Nascimento</FormLabel>
                              <FormControl><Input type="date" {...field} data-testid="input-dependent-birthdate" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <Button type="submit" className="w-full" disabled={createDependentMutation.isPending} data-testid="button-submit-dependent">
                            {createDependentMutation.isPending ? "Adicionando..." : "Adicionar"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loadingDeps ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : dependents && dependents.length > 0 ? (
                  <div className="space-y-4">
                    {dependents.map((dep: any) => (
                      <Card key={dep.id} data-testid={`card-dependent-${dep.id}`}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="font-semibold" data-testid={`text-dependent-name-${dep.id}`}>{dep.name}</h3>
                            <p className="text-sm text-muted-foreground">{dep.relationship} • CPF: {dep.cpf}</p>
                            {dep.birthDate && <p className="text-sm text-muted-foreground">Nascimento: {format(new Date(dep.birthDate), "dd/MM/yyyy")}</p>}
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => deleteDependentMutation.mutate(dep.id)} disabled={deleteDependentMutation.isPending} data-testid={`button-delete-dependent-${dep.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12" data-testid="card-no-dependents">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-muted-foreground">Nenhum dependente cadastrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" data-testid="tab-content-invoices">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingInvoices ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : invoices && invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.map((invoice: any) => (
                      <Card key={invoice.id} data-testid={`card-invoice-${invoice.id}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-2xl font-bold" data-testid={`text-invoice-amount-${invoice.id}`}>
                                R$ {parseFloat(invoice.amount).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">Vencimento: {format(new Date(invoice.dueDate), "dd/MM/yyyy")}</p>
                            </div>
                            <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className={invoice.status === 'paid' ? 'bg-green-600' : ''} data-testid={`badge-invoice-status-${invoice.id}`}>
                              {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {invoice.hostedInvoiceUrl && (
                              <Button variant="outline" className="w-full" onClick={() => window.open(invoice.hostedInvoiceUrl, '_blank')} data-testid={`button-view-invoice-${invoice.id}`}>
                                <FileText className="w-4 h-4 mr-2" />Ver Fatura
                              </Button>
                            )}
                            <Button variant="outline" className="w-full" onClick={() => generateCopyMutation.mutate(invoice.id)} disabled={generateCopyMutation.isPending} data-testid={`button-generate-copy-${invoice.id}`}>
                              <Download className="w-4 h-4 mr-2" />Gerar 2ª Via (PIX/Boleto)
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12" data-testid="card-no-invoices">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-muted-foreground">Nenhuma fatura encontrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

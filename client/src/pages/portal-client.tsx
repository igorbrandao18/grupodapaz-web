import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, CreditCard, Users, FileText, Plus, Trash2, CheckCircle, Heart, Loader2, LayoutDashboard, HelpCircle, Settings, ChevronLeft } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDependentSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { useState, useEffect } from "react";

const dependentFormSchema = insertDependentSchema.extend({
  birthDate: z.string().optional(),
});

type DependentFormData = z.infer<typeof dependentFormSchema>;

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Visão Geral", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "plan", label: "Meu Plano", icon: <Heart className="w-5 h-5" /> },
  { id: "dependents", label: "Dependentes", icon: <Users className="w-5 h-5" /> },
  { id: "payments", label: "Pagamentos", icon: <CreditCard className="w-5 h-5" /> },
  { id: "profile", label: "Meu Perfil", icon: <User className="w-5 h-5" /> },
];

function PortalClientContent() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [addDependentOpen, setAddDependentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { data: subscriptions, isLoading: loadingSubs } = useQuery<any[]>({
    queryKey: ['/api/subscriptions'],
  });

  const { data: dependents, isLoading: loadingDeps } = useQuery<any[]>({
    queryKey: ['/api/dependents'],
  });

  const { data: invoices, isLoading: loadingInvoices, refetch: refetchInvoices } = useQuery<any[]>({
    queryKey: ['/api/invoices'],
  });

  // Auto-sync invoices on first load
  const [hasAutoSynced, setHasAutoSynced] = useState(false);
  
  const syncInvoicesMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/invoices/sync", {}),
    onSuccess: () => {
      refetchInvoices();
      setHasAutoSynced(true);
    },
  });

  // Trigger auto-sync when component mounts
  useEffect(() => {
    if (!hasAutoSynced && !loadingInvoices && subscriptions) {
      const timer = setTimeout(() => {
        syncInvoicesMutation.mutate();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasAutoSynced, loadingInvoices, subscriptions]);

  const { data: allPlans, isLoading: loadingPlans } = useQuery<any[]>({
    queryKey: ['/api/plans'],
  });

  // Pegar assinatura e plano atual (plano já vem na subscription via JOIN)
  const currentSubscription = subscriptions?.[0];
  const currentPlan = currentSubscription?.plan;

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

  const generatePixMutation = useMutation({
    mutationFn: (invoiceId: number) => apiRequest("POST", `/api/invoices/${invoiceId}/generate-copy`, {}),
    onSuccess: async (response) => {
      const data = await response.json();
      setSelectedInvoice((prev: any) => ({ ...prev, ...data }));
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o PIX.",
        variant: "destructive",
      });
    },
  });

  const handleViewInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setActiveMenu("invoice-details");
    // Auto-gerar PIX/Boleto ao abrir detalhes
    if (!invoice.pixCode && !invoice.boletoUrl) {
      generatePixMutation.mutate(invoice.id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  // Filtrar planos disponíveis para upgrade (maiores que o plano atual)
  const currentPlanPrice = currentPlan ? parseFloat(currentPlan.price.replace(/[^\d,]/g, '').replace(',', '.')) : 0;
  const upgradeablePlans = allPlans?.filter((plan: any) => {
    const planPrice = parseFloat(plan.price.replace(/[^\d,]/g, '').replace(',', '.'));
    return planPrice > currentPlanPrice && plan.active && plan.id !== currentPlan?.id;
  }).sort((a: any, b: any) => {
    const priceA = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.'));
    const priceB = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.'));
    return priceA - priceB;
  }) || [];

  const handleUpgradePlan = async (planId: number) => {
    try {
      const response = await apiRequest("POST", "/api/create-checkout-session", {
        planId,
        email: profile?.email,
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível iniciar upgrade",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#28803d] to-[#1f6030] text-white flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-white" />
            <div>
              <h1 className="text-xl font-bold">Grupo da Paz</h1>
              <p className="text-xs text-green-100">Portal do Cliente</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{profile?.full_name || "Cliente"}</p>
              <p className="text-xs text-green-100 truncate">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeMenu === item.id
                  ? "bg-white text-[#28803d] shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
              data-testid={`menu-${item.id}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 space-y-2">
          {isAdmin && (
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => (window.location.href = "/admin")}
            >
              <Settings className="w-5 h-5 mr-3" />
              Painel Admin
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-gray-50">
        {/* Header Global com Informações do Plano */}
        {currentSubscription && currentPlan && (
          <div className="bg-gradient-to-r from-[#28803d] to-[#1f6030] text-white px-8 py-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-green-100 uppercase tracking-wide">Plano Atual</p>
                  <p className="text-xl font-bold">{currentPlan.name}</p>
                </div>
                <div className="h-8 w-px bg-green-300 opacity-50"></div>
                <div>
                  <p className="text-xs text-green-100">Cobertura</p>
                  <p className="text-sm font-semibold">{currentPlan.dependents} dependentes</p>
                </div>
                <div className="h-8 w-px bg-green-300 opacity-50"></div>
                <div>
                  <p className="text-xs text-green-100">Status</p>
                  <p className="text-sm font-semibold">
                    {currentSubscription.status === 'active' ? '✓ Ativo' : 'Inativo'}
                  </p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {currentPlan.is_popular ? 'Mais Popular' : 'Premium'}
              </Badge>
            </div>
          </div>
        )}

        {/* Conteúdo das Páginas */}
        <div className="p-8">
        {/* Dashboard */}
        {activeMenu === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Olá, {profile?.full_name?.split(' ')[0] || "Cliente"}! 👋</h1>
              <p className="text-gray-600 mt-1">Bem-vindo ao seu portal. Aqui você gerencia tudo relacionado ao seu plano.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-[#28803d]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Plano Ativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">{currentPlan?.name || "Sem plano"}</p>
                  {currentPlan && <p className="text-sm text-gray-600 mt-1">{currentPlan.price}</p>}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Dependentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">{dependents?.length || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentPlan ? `Limite: ${currentPlan.dependents}` : "Cadastre seu plano"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Faturas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">{invoices?.filter(i => i.status === 'paid').length || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Pagas este ano</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesso rápido às funcionalidades mais usadas</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 justify-start"
                  onClick={() => setActiveMenu("dependents")}
                >
                  <Users className="w-6 h-6 mr-3 text-[#28803d]" />
                  <div className="text-left">
                    <p className="font-semibold">Gerenciar Dependentes</p>
                    <p className="text-xs text-gray-600">Adicione ou remova beneficiários</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 justify-start"
                  onClick={() => setActiveMenu("invoices")}
                >
                  <FileText className="w-6 h-6 mr-3 text-[#28803d]" />
                  <div className="text-left">
                    <p className="font-semibold">Ver Faturas</p>
                    <p className="text-xs text-gray-600">Histórico e 2ª via de pagamentos</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Meu Plano */}
        {activeMenu === "plan" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Plano</h1>
              <p className="text-gray-600 mt-1">Detalhes do seu plano contratado</p>
            </div>

            {loadingSubs ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#28803d]" />
              </div>
            ) : currentPlan ? (
              <>
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-[#28803d] to-[#1f6030] p-8 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="bg-white/20 text-white mb-4">Plano Ativo</Badge>
                        <h2 className="text-3xl font-bold mb-2">{currentPlan.name}</h2>
                        <p className="text-green-100 mb-4">{currentPlan.description}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">{currentPlan.price}</span>
                        </div>
                      </div>
                      <Heart className="w-16 h-16 fill-white/20" />
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#28803d]" />
                          Cobertura
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="text-2xl font-bold text-gray-900">
                            {currentPlan.dependents === 1 ? "1 pessoa" : `Até ${currentPlan.dependents} dependentes`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">incluindo o titular</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-[#28803d]" />
                          Benefícios Inclusos
                        </h3>
                        <ul className="space-y-2">
                          {currentPlan.features?.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm" data-testid={`feature-${idx}`}>
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {currentSubscription && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Status da Assinatura</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge className="bg-green-600">
                            {currentSubscription.status === 'active' ? 'Ativo' : currentSubscription.status}
                          </Badge>
                          {currentSubscription.start_date && (
                            <span className="text-gray-600">
                              Desde {format(new Date(currentSubscription.start_date), "dd/MM/yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upgrade Options */}
                {upgradeablePlans.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Fazer Upgrade do Plano</h2>
                    <p className="text-gray-600 mb-6">Amplie sua cobertura e benefícios escolhendo um plano superior</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      {upgradeablePlans.map((plan: any) => (
                        <Card key={plan.id} className="relative overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#28803d]/20">
                          {plan.popular && (
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-yellow-500">Mais Escolhido</Badge>
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <span className="text-3xl font-bold text-[#28803d]">{plan.price}</span>
                              <span className="text-gray-600 ml-1">{plan.period}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg">
                              <Users className="w-4 h-4 text-[#28803d] inline mr-2" />
                              <span className="text-sm font-medium">
                                {plan.dependents === 1 ? '1 pessoa' : `Até ${plan.dependents} dependentes`}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-2">Benefícios inclusos:</p>
                              <ul className="space-y-1">
                                {plan.features.slice(0, 4).map((feature: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                                {plan.features.length > 4 && (
                                  <li className="text-sm text-gray-500 ml-6">+ {plan.features.length - 4} benefícios adicionais</li>
                                )}
                              </ul>
                            </div>
                            <Button 
                              className="w-full bg-[#28803d] hover:bg-[#1f6030]"
                              onClick={() => handleUpgradePlan(plan.id)}
                            >
                              Fazer Upgrade
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Heart className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum plano ativo</h3>
                  <p className="text-gray-600 mb-6">Contrate um plano para proteger você e sua família</p>
                  <Button onClick={() => (window.location.href = "/")} className="bg-[#28803d] hover:bg-[#1f6030]">
                    Ver Planos Disponíveis
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Dependentes */}
        {activeMenu === "dependents" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dependentes</h1>
                <p className="text-gray-600 mt-1">Gerencie os beneficiários do seu plano</p>
              </div>
              <Dialog open={addDependentOpen} onOpenChange={setAddDependentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#28803d] hover:bg-[#1f6030]" data-testid="button-add-dependent">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Dependente
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
                      <Button type="submit" className="w-full bg-[#28803d] hover:bg-[#1f6030]" disabled={createDependentMutation.isPending} data-testid="button-submit-dependent">
                        {createDependentMutation.isPending ? "Adicionando..." : "Adicionar Dependente"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Banner de Cobertura de Dependentes */}
            {currentPlan && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          Cobertura de Dependentes
                        </h3>
                        <p className="text-sm text-gray-600">
                          Seu plano <span className="font-semibold text-blue-700">{currentPlan.name}</span> cobre até <span className="font-bold">{currentPlan.dependents} dependentes</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-blue-600">
                          {dependents?.length || 0}
                        </span>
                        <span className="text-xl text-gray-500">/ {currentPlan.dependents}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {(dependents?.length || 0) >= currentPlan.dependents 
                          ? '🚫 Limite atingido' 
                          : `✓ ${currentPlan.dependents - (dependents?.length || 0)} vagas disponíveis`
                        }
                      </p>
                    </div>
                  </div>
                  {(dependents?.length || 0) >= currentPlan.dependents && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>💡 Dica:</strong> Você atingiu o limite de dependentes do seu plano. Para adicionar mais, faça upgrade para um plano superior.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {loadingDeps ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#28803d]" />
              </div>
            ) : dependents && dependents.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {dependents.map((dep: any) => (
                  <Card key={dep.id} data-testid={`card-dependent-${dep.id}`} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-[#28803d]/10 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-[#28803d]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg" data-testid={`text-dependent-name-${dep.id}`}>{dep.name}</h3>
                              <p className="text-sm text-gray-600">{dep.relationship}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">CPF:</span> {dep.cpf}</p>
                            {dep.birth_date && (
                              <p><span className="font-medium">Nascimento:</span> {format(new Date(dep.birth_date), "dd/MM/yyyy")}</p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteDependentMutation.mutate(dep.id)} 
                          disabled={deleteDependentMutation.isPending} 
                          data-testid={`button-delete-dependent-${dep.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Users className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum dependente cadastrado</h3>
                  <p className="text-gray-600">Adicione dependentes para ampliar a cobertura do seu plano</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Pagamentos / Faturas */}
        {activeMenu === "payments" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Histórico de Pagamentos</h1>
              <p className="text-gray-600 mt-1">Consulte suas faturas e gere 2ª via com PIX ou Boleto</p>
            </div>

            {loadingInvoices ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#28803d]" />
              </div>
            ) : invoices && invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((invoice: any) => (
                  <Card 
                    key={invoice.id} 
                    data-testid={`card-invoice-${invoice.id}`} 
                    className="hover:shadow-xl transition-all cursor-pointer border-l-4 hover:border-l-[#28803d]"
                    onClick={() => handleViewInvoiceDetails(invoice)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#28803d] to-[#1f6030] rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-gray-900" data-testid={`text-invoice-amount-${invoice.id}`}>
                                R$ {parseFloat(invoice.amount).toFixed(2)}
                              </p>
                              <Badge 
                                variant={invoice.status === 'paid' ? 'default' : 'secondary'} 
                                className={invoice.status === 'paid' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'} 
                                data-testid={`badge-invoice-status-${invoice.id}`}
                              >
                                {invoice.status === 'paid' ? '✓ Pago' : '⏳ Pendente'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>📅 Venc: {format(new Date(invoice.due_date), "dd/MM/yyyy")}</span>
                              {invoice.created_at && (
                                <>
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  <span>💳 Pago em: {format(new Date(invoice.created_at), "dd/MM/yyyy")}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
                  <p className="text-gray-600 text-center">
                    Seus pagamentos aparecerão aqui após a primeira cobrança.<br />
                    O histórico é sincronizado automaticamente.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Detalhes da Fatura - Tela Completa */}
        {activeMenu === "invoice-details" && selectedInvoice && (
          <div className="space-y-6">
            {/* Botão Voltar */}
            <div>
              <Button
                variant="ghost"
                onClick={() => setActiveMenu("payments")}
                className="mb-4"
                data-testid="button-back-to-payments"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar para Pagamentos
              </Button>
            </div>

            {/* Header Profissional */}
            <div className="bg-white border rounded-lg px-8 py-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">COMPROVANTE DE PAGAMENTO</p>
                  <h2 className="text-3xl font-bold text-gray-900">Fatura #{selectedInvoice.id}</h2>
                </div>
                <Badge 
                  className={`text-sm px-4 py-2 ${selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {selectedInvoice.status === 'paid' ? '✓ Pagamento Confirmado' : '⏳ Aguardando Pagamento'}
                </Badge>
              </div>
            </div>

            {/* Valor em Destaque */}
            <Card className="bg-gradient-to-br from-slate-50 to-white">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Valor Total</p>
                    <p className="text-5xl font-bold text-[#28803d]">
                      R$ {parseFloat(selectedInvoice.amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 mb-2">Data de Vencimento</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {format(new Date(selectedInvoice.due_date), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#28803d]" />
                  Detalhes do Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Data de Processamento</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedInvoice.created_at 
                          ? format(new Date(selectedInvoice.created_at), "dd/MM/yyyy 'às' HH:mm") 
                          : 'Processando...'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {selectedInvoice.status === 'paid' ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-base font-semibold text-green-700">Pago e Confirmado</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="w-5 h-5 text-yellow-600" />
                            <span className="text-base font-semibold text-yellow-700">Aguardando Pagamento</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Método de Pagamento</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedInvoice.payment_method || 'Cartão de Crédito'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ID da Fatura</p>
                      <p className="text-base font-mono font-medium text-gray-900 bg-slate-50 px-3 py-2 rounded">
                        {selectedInvoice.stripe_invoice_id || `INV-${selectedInvoice.id}`}
                      </p>
                    </div>

                    {selectedInvoice.hosted_invoice_url && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fatura Online</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedInvoice.hosted_invoice_url, '_blank')}
                          className="w-full justify-start"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver no Stripe
                        </Button>
                      </div>
                    )}

                    {selectedInvoice.invoice_pdf_url && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Baixar PDF</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedInvoice.invoice_pdf_url, '_blank')}
                          className="w-full justify-start"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opções de 2ª Via */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#28803d]" />
                  Gerar 2ª Via de Pagamento
                </CardTitle>
                <CardDescription>
                  Escolha uma das opções abaixo para gerar uma segunda via:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {(selectedInvoice.pixCode || generatePixMutation.isPending) && (
                    <Card className="border-2 border-green-200 hover:border-green-400 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">PIX</h4>
                            <p className="text-xs text-gray-600">Pagamento instantâneo</p>
                          </div>
                        </div>
                        {selectedInvoice.pixCode ? (
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="font-mono text-xs break-all text-gray-700 line-clamp-3">
                                {selectedInvoice.pixCode}
                              </p>
                            </div>
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                navigator.clipboard.writeText(selectedInvoice.pixCode);
                                toast({
                                  title: "✅ Código PIX Copiado!",
                                  description: "Cole no app do seu banco",
                                });
                              }}
                            >
                              Copiar Código PIX
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-green-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600">Gerando...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {(selectedInvoice.boletoUrl || generatePixMutation.isPending) && (
                    <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Boleto</h4>
                            <p className="text-xs text-gray-600">Pague em qualquer banco</p>
                          </div>
                        </div>
                        {selectedInvoice.boletoUrl ? (
                          <div className="space-y-3">
                            {selectedInvoice.boletoBarcode && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="font-mono text-xs text-center text-gray-700">
                                  {selectedInvoice.boletoBarcode}
                                </p>
                              </div>
                            )}
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              onClick={() => window.open(selectedInvoice.boletoUrl, '_blank')}
                            >
                              Baixar Boleto PDF
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600">Gerando...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {!selectedInvoice.pixCode && !selectedInvoice.boletoUrl && !generatePixMutation.isPending && (
                    <div className="col-span-2">
                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-8 text-center">
                          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-4">
                            {selectedInvoice.status === 'paid' 
                              ? 'Pagamento já confirmado. Gerando opções de 2ª via...'
                              : 'Clique para gerar PIX ou Boleto'}
                          </p>
                          <Button
                            onClick={() => generatePixMutation.mutate(selectedInvoice.id)}
                            disabled={generatePixMutation.isPending}
                            className="bg-[#28803d] hover:bg-[#1f6030]"
                          >
                            Gerar PIX e Boleto
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Meu Perfil */}
        {activeMenu === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600 mt-1">Informações da sua conta</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Suas informações cadastradas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile?.full_name || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile?.email}</p>
                  </div>
                  {profile?.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telefone</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{profile.phone}</p>
                    </div>
                  )}
                  {profile?.cpf && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">CPF</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{profile.cpf}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Conta verificada e ativa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#28803d]/20 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-[#28803d] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Precisa de ajuda?</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Entre em contato conosco para alterar suas informações ou tirar dúvidas.
                    </p>
                    <p className="text-sm font-semibold text-[#28803d]">
                      📞 (85) 3456-7890 | 📧 contato@grupodapaz.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </main>
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

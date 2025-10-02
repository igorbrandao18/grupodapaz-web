import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Profile, Plan } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, User } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AdminClientsContent() {
  const { toast } = useToast();

  const { data: clients, isLoading } = useQuery<Profile[]>({
    queryKey: ['/api/profiles'],
    queryFn: async () => {
      const res = await fetch('/api/profiles');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: plans } = useQuery<Plan[]>({
    queryKey: ['/api/plans', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/plans/all');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Profile> }) => {
      return apiRequest(`/api/profiles/${id}`, 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      toast({ title: "Cliente atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar cliente", variant: "destructive" });
    },
  });

  const handlePlanChange = (clientId: string, planId: string) => {
    updateProfileMutation.mutate({
      id: clientId,
      data: { planId: parseInt(planId) },
    });
  };

  const handleRoleChange = (clientId: string, role: string) => {
    updateProfileMutation.mutate({
      id: clientId,
      data: { role },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
            <p className="text-muted-foreground">Visualizar e gerenciar todos os clientes</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p>Carregando clientes...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients?.map((client) => {
              const clientPlan = plans?.find(p => p.id === client.planId);
              
              return (
                <Card key={client.id} data-testid={`client-card-${client.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {client.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-primary" />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="text-lg font-bold">{client.fullName || "Sem nome"}</h3>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Telefone</p>
                        <p className="text-sm text-muted-foreground">{client.phone || "Não informado"}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Perfil</p>
                        <Select
                          value={client.role}
                          onValueChange={(value) => handleRoleChange(client.id, value)}
                        >
                          <SelectTrigger data-testid={`select-role-${client.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Cliente</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Plano</p>
                        <Select
                          value={client.planId?.toString() || ""}
                          onValueChange={(value) => handlePlanChange(client.id, value)}
                        >
                          <SelectTrigger data-testid={`select-plan-${client.id}`}>
                            <SelectValue placeholder="Sem plano" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Sem plano</SelectItem>
                            {plans?.filter(p => p.active).map((plan) => (
                              <SelectItem key={plan.id} value={plan.id.toString()}>
                                {plan.name} - {plan.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {clientPlan && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Plano Atual:</strong> {clientPlan.name} - {clientPlan.price}{clientPlan.period}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {clients?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminClients() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminClientsContent />
    </ProtectedRoute>
  );
}

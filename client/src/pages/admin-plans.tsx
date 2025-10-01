import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Power, PowerOff, ArrowLeft } from "lucide-react";
import type { Plan } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlanSchema } from "@shared/schema";
import { z } from "zod";

const planFormSchema = insertPlanSchema.extend({
  features: z.string().transform(val => val.split('\n').filter(Boolean)),
});

export default function AdminPlans() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ['/api/plans', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/plans/all');
      if (!res.ok) throw new Error('Failed to fetch plans');
      return res.json();
    },
  });

  const form = useForm({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: '',
      price: '',
      period: '/mês',
      description: '',
      dependents: 1,
      popular: false,
      active: true,
      image: '',
      features: '',
      displayOrder: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertPlanSchema>) => {
      return apiRequest('/api/plans', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plans', 'all'] });
      toast({ title: "Plano criado com sucesso!" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Erro ao criar plano", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Plan> }) => {
      return apiRequest(`/api/plans/${id}`, 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plans', 'all'] });
      toast({ title: "Plano atualizado com sucesso!" });
      setIsDialogOpen(false);
      setEditingPlan(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Erro ao atualizar plano", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/plans/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plans', 'all'] });
      toast({ title: "Plano deletado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao deletar plano", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      return apiRequest(`/api/plans/${id}/status`, 'PATCH', { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plans', 'all'] });
      toast({ title: "Status atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    },
  });

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      price: plan.price,
      period: plan.period,
      description: plan.description || '',
      dependents: plan.dependents,
      popular: plan.popular,
      active: plan.active,
      image: plan.image || '',
      features: plan.features.join('\n'),
      displayOrder: plan.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    const planData = {
      ...data,
      features: data.features.split('\n').filter((f: string) => f.trim()),
    };

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: planData });
    } else {
      createMutation.mutate(planData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Gerenciar Planos</h1>
              <p className="text-muted-foreground">Criar, editar e gerenciar planos de proteção</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingPlan(null); form.reset(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
                <DialogDescription>
                  {editingPlan ? 'Edite as informações do plano' : 'Crie um novo plano de proteção'}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Plano *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Plano Básico" {...field} data-testid="input-plan-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: R$ 89,90" {...field} data-testid="input-plan-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Período *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: /mês" {...field} data-testid="input-plan-period" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrição do plano" 
                            {...field} 
                            data-testid="input-plan-description"
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dependents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dependentes *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-plan-dependents" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ordem de Exibição *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-plan-order" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} data-testid="input-plan-image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Características (uma por linha) *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Velório 24h&#10;Sepultamento&#10;Transporte local" 
                            {...field}
                            rows={5}
                            data-testid="input-plan-features"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="popular"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <input 
                              type="checkbox" 
                              checked={field.value} 
                              onChange={field.onChange}
                              data-testid="checkbox-plan-popular"
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Marcar como popular</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <input 
                              type="checkbox" 
                              checked={field.value} 
                              onChange={field.onChange}
                              data-testid="checkbox-plan-active"
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Ativo</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-plan">
                      {editingPlan ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p>Carregando planos...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {plans?.map((plan) => (
              <div key={plan.id} className="bg-card border rounded-lg p-6" data-testid={`plan-card-${plan.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.popular && (
                        <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">{plan.price}{plan.period}</p>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                    )}
                    <p className="text-sm"><strong>Dependentes:</strong> {plan.dependents}</p>
                    <p className="text-sm"><strong>Características:</strong> {plan.features.length} itens</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleActiveMutation.mutate({ id: plan.id, active: !plan.active })}
                      data-testid={`button-toggle-${plan.id}`}
                    >
                      {plan.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(plan)}
                      data-testid={`button-edit-${plan.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja deletar o plano "${plan.name}"?`)) {
                          deleteMutation.mutate(plan.id);
                        }
                      }}
                      data-testid={`button-delete-${plan.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {plans?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Nenhum plano cadastrado</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

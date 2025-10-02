import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import type { Profile, Plan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, CreditCard, Settings } from "lucide-react";
import { Link } from "wouter";
import ProtectedRoute from "@/components/protected-route";

function PortalAdminContent() {
  const { profile, signOut } = useAuth();

  const { data: clients } = useQuery<Profile[]>({
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

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const totalClients = clients?.filter(p => p.role === 'client').length || 0;
  const activePlans = plans?.filter(p => p.active).length || 0;

  return (
    <div className="min-h-screen bg-muted">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Portal Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin: {profile?.fullName}</span>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground mt-1">Clientes cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlans}</div>
              <p className="text-xs text-muted-foreground mt-1">Planos disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
              <Settings className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plans?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Incluindo inativos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Gerenciar o sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/plans">
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Gerenciar Planos
                </Button>
              </Link>
              <Link href="/admin/clients">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Clientes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>Últimos cadastros</CardDescription>
            </CardHeader>
            <CardContent>
              {clients && clients.length > 0 ? (
                <div className="space-y-3">
                  {clients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{client.fullName || client.email}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        client.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {client.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum cliente cadastrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PortalAdmin() {
  return (
    <ProtectedRoute requireAdmin>
      <PortalAdminContent />
    </ProtectedRoute>
  );
}

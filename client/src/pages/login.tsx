import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, Shield, Users, CheckCircle } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { signIn, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirecionar automaticamente se já estiver logado
  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role === 'admin') {
        setLocation("/admin");
      } else {
        setLocation("/portal");
      }
    }
  }, [profile, authLoading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      
      // Aguardar um pouco para garantir que o contexto de auth seja atualizado
      setTimeout(() => {
        toast({
          title: "Bem-vindo de volta!",
          description: "Acesso ao portal liberado",
        });
        
        // Redirecionar baseado no role do usuário
        if (profile?.role === 'admin') {
          setLocation("/admin");
        } else {
          setLocation("/portal");
        }
      }, 500);
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#28803d]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#28803d]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#28803d]/5 rounded-full blur-3xl" />
      </div>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12 bg-gradient-to-br from-[#28803d] to-[#1f6030]">
        <div className="max-w-md text-white space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-12 h-12 fill-white" />
              <h1 className="text-4xl font-bold">Grupo da Paz</h1>
            </div>
            <p className="text-green-100 text-lg leading-relaxed">
              Há mais de 30 anos cuidando de você e sua família com respeito, dignidade e compaixão nos momentos mais difíceis.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-white/20 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Proteção Completa</h3>
                <p className="text-green-100 text-sm">Cobertura 24 horas com atendimento humanizado</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-white/20 p-3 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Planos Familiares</h3>
                <p className="text-green-100 text-sm">Proteja até 6 dependentes com um único plano</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-white/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Confiança e Tradição</h3>
                <p className="text-green-100 text-sm">Mais de 10 mil famílias atendidas com excelência</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20">
            <p className="text-green-100 text-sm italic">
              "No momento mais difícil, encontramos no Grupo da Paz o acolhimento e profissionalismo que precisávamos."
            </p>
            <p className="text-white text-sm mt-2 font-medium">— Maria Silva, cliente desde 2020</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-8 lg:p-12">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <Heart className="w-8 h-8 fill-[#28803d] text-[#28803d]" />
              <h1 className="text-2xl font-bold text-[#28803d]">Grupo da Paz</h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Portal do Cliente
              </h2>
              <p className="text-gray-600">
                Acesse sua conta para gerenciar seu plano
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="h-12 text-base border-gray-300 focus:border-[#28803d] focus:ring-[#28803d]"
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <Input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  minLength={6}
                  className="h-12 text-base border-gray-300 focus:border-[#28803d] focus:ring-[#28803d]"
                  data-testid="input-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-[#28803d] hover:bg-[#1f6030] text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={loading} 
                data-testid="button-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Acessar Portal"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-semibold text-[#28803d]">Não tem conta?</span><br />
                  Contrate um plano no site para receber suas credenciais por email
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-3 border-[#28803d] text-[#28803d] hover:bg-[#28803d] hover:text-white"
                  onClick={() => window.location.href = "/"}
                >
                  Ver Planos Disponíveis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

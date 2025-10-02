import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import Home from "@/pages/home";
import Login from "@/pages/login";
import PortalClient from "@/pages/portal-client";
import PortalAdmin from "@/pages/portal-admin";
import AdminPlans from "@/pages/admin-plans";
import AdminClients from "@/pages/admin-clients";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/portal" component={PortalClient} />
      <Route path="/admin" component={PortalAdmin} />
      <Route path="/admin/plans" component={AdminPlans} />
      <Route path="/admin/clients" component={AdminClients} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

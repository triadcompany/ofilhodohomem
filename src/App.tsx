import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Cultos from "./pages/Cultos";
import CultoDetail from "./pages/CultoDetail";
import Estudos from "./pages/Estudos";
import EstudoDetail from "./pages/EstudoDetail";
import Sobre from "./pages/Sobre";
import AoVivo from "./pages/AoVivo";
import Contato from "./pages/Contato";
import VinteAnosMinisterio from "./pages/VinteAnosMinisterio";
import OInicio from "./pages/OInicio";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCultos from "./pages/AdminCultos";
import AdminEstudos from "./pages/AdminEstudos";
import AdminAgenda from "./pages/AdminAgenda";
import AdminConfiguracoes from "./pages/AdminConfiguracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cultos" element={<Cultos />} />
            <Route path="/cultos/:id" element={<CultoDetail />} />
            <Route path="/estudos" element={<Estudos />} />
            <Route path="/estudos/:id" element={<EstudoDetail />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/ao-vivo" element={<AoVivo />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/nossa-historia/20-anos" element={<VinteAnosMinisterio />} />
            <Route path="/nossa-historia/o-inicio" element={<OInicio />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="cultos" element={<AdminCultos />} />
              <Route path="estudos" element={<AdminEstudos />} />
              <Route path="agenda" element={<AdminAgenda />} />
              <Route path="configuracoes" element={<AdminConfiguracoes />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

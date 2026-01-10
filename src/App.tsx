import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cultos from "./pages/Cultos";
import CultoDetail from "./pages/CultoDetail";
import Estudos from "./pages/Estudos";
import EstudoDetail from "./pages/EstudoDetail";
import Sobre from "./pages/Sobre";
import AoVivo from "./pages/AoVivo";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

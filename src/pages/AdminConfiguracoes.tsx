import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminConfiguracoes = () => {
  const { user } = useAuth();
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, sign up the new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Add admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{ user_id: signUpData.user.id, role: "admin" }]);

        if (roleError) throw roleError;

        toast.success("Administrador adicionado com sucesso!");
        setIsAddAdminOpen(false);
        setNewAdminEmail("");
        setNewAdminPassword("");
      }
    } catch (error: any) {
      toast.error("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Configurações
        </h1>
        <p className="font-body text-muted-foreground mt-2">
          Gerencie as configurações do painel
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Current User */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Minha Conta
              </h2>
              <p className="font-ui text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Add Admin */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Gerenciar Administradores
              </h2>
              <p className="font-ui text-sm text-muted-foreground">
                Adicione novos administradores ao sistema
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAddAdminOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Administrador
          </Button>
        </div>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Adicionar Administrador
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAdmin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newEmail">E-mail *</Label>
              <Input
                id="newEmail"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Senha *</Label>
              <Input
                id="newPassword"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="gold" disabled={loading}>
                {loading ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConfiguracoes;

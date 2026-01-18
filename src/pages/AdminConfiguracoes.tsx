import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Lock, Plus, Globe, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Save, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface SiteConfig {
  church_name: string;
  church_subtitle: string;
  description: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
}

const defaultConfig: SiteConfig = {
  church_name: "Tabernáculo",
  church_subtitle: "O Filho do Homem",
  description: "Uma comunidade de fé dedicada a proclamar a mensagem de Cristo e servir ao próximo com amor.",
  address_line1: "Rua Exemplo, 123",
  address_line2: "Centro - Cidade/UF",
  phone: "(00) 00000-0000",
  email: "contato@tabernaculo.com",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
};

const AdminConfiguracoes = () => {
  const { user } = useAuth();
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("church_info")
        .select("key, value");

      if (error) throw error;

      if (data && data.length > 0) {
        const configFromDb: Partial<SiteConfig> = {};
        data.forEach((item) => {
          if (item.key in defaultConfig) {
            configFromDb[item.key as keyof SiteConfig] = item.value || "";
          }
        });
        setSiteConfig({ ...defaultConfig, ...configFromDb });
      }
    } catch (error: any) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const updates = Object.entries(siteConfig).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("church_info")
          .upsert(update, { onConflict: "key" });

        if (error) throw error;
      }

      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao salvar: " + error.message);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
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

  const updateConfig = (key: keyof SiteConfig, value: string) => {
    setSiteConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (loadingConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Configurações
        </h1>
        <p className="font-body text-muted-foreground mt-2">
          Gerencie as configurações do site e painel
        </p>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="site" className="gap-2">
            <Globe className="w-4 h-4" />
            Site
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            Conta
          </TabsTrigger>
        </TabsList>

        {/* Site Settings */}
        <TabsContent value="site" className="space-y-6 max-w-3xl">
          {/* Header / Identity */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Identidade do Site
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Nome e descrição exibidos no cabeçalho e rodapé
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="church_name">Nome da Igreja</Label>
                <Input
                  id="church_name"
                  value={siteConfig.church_name}
                  onChange={(e) => updateConfig("church_name", e.target.value)}
                  placeholder="Tabernáculo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="church_subtitle">Subtítulo</Label>
                <Input
                  id="church_subtitle"
                  value={siteConfig.church_subtitle}
                  onChange={(e) => updateConfig("church_subtitle", e.target.value)}
                  placeholder="O Filho do Homem"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={siteConfig.description}
                  onChange={(e) => updateConfig("description", e.target.value)}
                  placeholder="Uma breve descrição da igreja..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Informações de Contato
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Endereço, telefone e e-mail exibidos no rodapé
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address_line1" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Endereço (Linha 1)
                </Label>
                <Input
                  id="address_line1"
                  value={siteConfig.address_line1}
                  onChange={(e) => updateConfig("address_line1", e.target.value)}
                  placeholder="Rua Exemplo, 123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_line2">Endereço (Linha 2)</Label>
                <Input
                  id="address_line2"
                  value={siteConfig.address_line2}
                  onChange={(e) => updateConfig("address_line2", e.target.value)}
                  placeholder="Centro - Cidade/UF"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={siteConfig.phone}
                  onChange={(e) => updateConfig("phone", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={siteConfig.email}
                  onChange={(e) => updateConfig("email", e.target.value)}
                  placeholder="contato@tabernaculo.com"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Redes Sociais
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Links para as redes sociais da igreja
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="facebook_url" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-muted-foreground" />
                  Facebook
                </Label>
                <Input
                  id="facebook_url"
                  value={siteConfig.facebook_url}
                  onChange={(e) => updateConfig("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                  Instagram
                </Label>
                <Input
                  id="instagram_url"
                  value={siteConfig.instagram_url}
                  onChange={(e) => updateConfig("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-muted-foreground" />
                  YouTube
                </Label>
                <Input
                  id="youtube_url"
                  value={siteConfig.youtube_url}
                  onChange={(e) => updateConfig("youtube_url", e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              variant="gold"
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="gap-2"
            >
              {savingConfig ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {savingConfig ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6 max-w-2xl">
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
        </TabsContent>
      </Tabs>

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

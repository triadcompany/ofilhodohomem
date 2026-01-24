import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Lock, Plus, Globe, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Save, Loader2, Image, Upload, X, BookOpen, MessageCircle, Map } from "lucide-react";
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
  hero_welcome_text: string;
  hero_title: string;
  hero_subtitle: string;
  hero_verse: string;
  hero_verse_reference: string;
  hero_image_url: string;
  // About page
  about_history: string;
  about_mission: string;
  about_vision: string;
  about_value_1_title: string;
  about_value_1_description: string;
  about_value_2_title: string;
  about_value_2_description: string;
  about_value_3_title: string;
  about_value_3_description: string;
  about_value_4_title: string;
  about_value_4_description: string;
  // Contact page
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  contact_schedule: string;
  contact_whatsapp: string;
  contact_facebook_url: string;
  contact_instagram_url: string;
  contact_youtube_url: string;
  contact_map_embed_url: string;
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
  hero_welcome_text: "Bem-vindo ao",
  hero_title: "Tabernáculo",
  hero_subtitle: "O Filho do Homem",
  hero_verse: "Porque o Filho do Homem veio buscar e salvar o que se havia perdido.",
  hero_verse_reference: "Lucas 19:10",
  hero_image_url: "",
  // About page
  about_history: "",
  about_mission: "",
  about_vision: "",
  about_value_1_title: "Fidelidade à Palavra",
  about_value_1_description: "",
  about_value_2_title: "Amor ao Próximo",
  about_value_2_description: "",
  about_value_3_title: "Compromisso com a Verdade",
  about_value_3_description: "",
  about_value_4_title: "Adoração Reverente",
  about_value_4_description: "",
  // Contact page
  contact_address: "",
  contact_phone: "",
  contact_email: "",
  contact_schedule: "",
  contact_whatsapp: "",
  contact_facebook_url: "",
  contact_instagram_url: "",
  contact_youtube_url: "",
  contact_map_embed_url: "",
};

const AdminConfiguracoes = () => {
  const { user } = useAuth();
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultConfig);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(filePath);

      updateConfig("hero_image_url", urlData.publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao enviar imagem: " + error.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    updateConfig("hero_image_url", "");
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
        <TabsList className="bg-muted flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="site" className="gap-2">
            <Globe className="w-4 h-4" />
            Site
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Sobre
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Contato
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

          {/* Hero Section */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Image className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Seção Hero (Banner Principal)
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Imagem de fundo e textos da página inicial
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Imagem de Fundo</Label>
                <div className="flex flex-col gap-4">
                  {siteConfig.hero_image_url ? (
                    <div className="relative aspect-video max-w-md rounded-lg overflow-hidden border border-border">
                      <img
                        src={siteConfig.hero_image_url}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-video max-w-md rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                      <p className="text-sm text-muted-foreground">Nenhuma imagem selecionada</p>
                    </div>
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="hero-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="gap-2"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploadingImage ? "Enviando..." : "Enviar Imagem"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tamanho recomendado: 1920x1080. Máximo: 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero Texts */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hero_welcome_text">Texto de Boas-vindas</Label>
                  <Input
                    id="hero_welcome_text"
                    value={siteConfig.hero_welcome_text}
                    onChange={(e) => updateConfig("hero_welcome_text", e.target.value)}
                    placeholder="Bem-vindo ao"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Título Principal</Label>
                  <Input
                    id="hero_title"
                    value={siteConfig.hero_title}
                    onChange={(e) => updateConfig("hero_title", e.target.value)}
                    placeholder="Tabernáculo"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="hero_subtitle">Subtítulo</Label>
                  <Input
                    id="hero_subtitle"
                    value={siteConfig.hero_subtitle}
                    onChange={(e) => updateConfig("hero_subtitle", e.target.value)}
                    placeholder="O Filho do Homem"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="hero_verse">Versículo</Label>
                  <Textarea
                    id="hero_verse"
                    value={siteConfig.hero_verse}
                    onChange={(e) => updateConfig("hero_verse", e.target.value)}
                    placeholder="Porque o Filho do Homem veio buscar e salvar o que se havia perdido."
                    rows={2}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="hero_verse_reference">Referência do Versículo</Label>
                  <Input
                    id="hero_verse_reference"
                    value={siteConfig.hero_verse_reference}
                    onChange={(e) => updateConfig("hero_verse_reference", e.target.value)}
                    placeholder="Lucas 19:10"
                  />
                </div>
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

        {/* About Page Settings */}
        <TabsContent value="about" className="space-y-6 max-w-3xl">
          {/* History */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  História
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Texto exibido na seção "Nossa Trajetória"
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about_history">Texto da História</Label>
              <Textarea
                id="about_history"
                value={siteConfig.about_history}
                onChange={(e) => updateConfig("about_history", e.target.value)}
                placeholder="Descreva a história da igreja..."
                rows={8}
              />
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Missão e Visão
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Propósito e objetivos da igreja
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_mission">Missão</Label>
                <Textarea
                  id="about_mission"
                  value={siteConfig.about_mission}
                  onChange={(e) => updateConfig("about_mission", e.target.value)}
                  placeholder="Qual é a missão da igreja..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_vision">Visão</Label>
                <Textarea
                  id="about_vision"
                  value={siteConfig.about_vision}
                  onChange={(e) => updateConfig("about_vision", e.target.value)}
                  placeholder="Qual é a visão da igreja..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Valores
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Os 4 valores principais da igreja
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="grid gap-4 sm:grid-cols-2 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`about_value_${num}_title`}>Valor {num} - Título</Label>
                    <Input
                      id={`about_value_${num}_title`}
                      value={siteConfig[`about_value_${num}_title` as keyof SiteConfig] || ""}
                      onChange={(e) => updateConfig(`about_value_${num}_title` as keyof SiteConfig, e.target.value)}
                      placeholder={`Título do valor ${num}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`about_value_${num}_description`}>Valor {num} - Descrição</Label>
                    <Input
                      id={`about_value_${num}_description`}
                      value={siteConfig[`about_value_${num}_description` as keyof SiteConfig] || ""}
                      onChange={(e) => updateConfig(`about_value_${num}_description` as keyof SiteConfig, e.target.value)}
                      placeholder={`Descrição do valor ${num}`}
                    />
                  </div>
                </div>
              ))}
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

        {/* Contact Page Settings */}
        <TabsContent value="contact" className="space-y-6 max-w-3xl">
          {/* Contact Info */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Informações de Contato
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Dados exibidos na página de Contato
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="contact_address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Endereço (use Enter para quebrar linha)
                </Label>
                <Textarea
                  id="contact_address"
                  value={siteConfig.contact_address}
                  onChange={(e) => updateConfig("contact_address", e.target.value)}
                  placeholder="Rua Exemplo, 123&#10;Bairro Centro&#10;Cidade - Estado, CEP 00000-000"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Telefone(s) (use Enter para quebrar linha)
                </Label>
                <Textarea
                  id="contact_phone"
                  value={siteConfig.contact_phone}
                  onChange={(e) => updateConfig("contact_phone", e.target.value)}
                  placeholder="(00) 0000-0000&#10;(00) 00000-0000"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  E-mail
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={siteConfig.contact_email}
                  onChange={(e) => updateConfig("contact_email", e.target.value)}
                  placeholder="contato@tabernaculo.com"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="contact_schedule">Horários dos Cultos (use Enter para quebrar linha)</Label>
                <Textarea
                  id="contact_schedule"
                  value={siteConfig.contact_schedule}
                  onChange={(e) => updateConfig("contact_schedule", e.target.value)}
                  placeholder="Domingo: 09h e 19h&#10;Quarta-feira: 19h30&#10;Sexta-feira: 20h"
                  rows={3}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="contact_whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  WhatsApp (apenas números com código do país)
                </Label>
                <Input
                  id="contact_whatsapp"
                  value={siteConfig.contact_whatsapp}
                  onChange={(e) => updateConfig("contact_whatsapp", e.target.value)}
                  placeholder="5511999999999"
                />
              </div>
            </div>
          </div>

          {/* Social Media for Contact */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Redes Sociais (Página de Contato)
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  Links exibidos na página de Contato
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="contact_facebook_url" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-muted-foreground" />
                  Facebook
                </Label>
                <Input
                  id="contact_facebook_url"
                  value={siteConfig.contact_facebook_url}
                  onChange={(e) => updateConfig("contact_facebook_url", e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_instagram_url" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                  Instagram
                </Label>
                <Input
                  id="contact_instagram_url"
                  value={siteConfig.contact_instagram_url}
                  onChange={(e) => updateConfig("contact_instagram_url", e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_youtube_url" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-muted-foreground" />
                  YouTube
                </Label>
                <Input
                  id="contact_youtube_url"
                  value={siteConfig.contact_youtube_url}
                  onChange={(e) => updateConfig("contact_youtube_url", e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Mapa
                </h2>
                <p className="font-ui text-sm text-muted-foreground">
                  URL de incorporação do Google Maps
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_map_embed_url">URL do Embed do Mapa</Label>
                <Input
                  id="contact_map_embed_url"
                  value={siteConfig.contact_map_embed_url}
                  onChange={(e) => updateConfig("contact_map_embed_url", e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-xs text-muted-foreground">
                  Acesse o Google Maps, clique em "Compartilhar", selecione "Incorporar mapa" e copie apenas a URL do src.
                </p>
              </div>
              {siteConfig.contact_map_embed_url && (
                <div className="aspect-video rounded-lg overflow-hidden border border-border">
                  <iframe
                    src={siteConfig.contact_map_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Preview do Mapa"
                  />
                </div>
              )}
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

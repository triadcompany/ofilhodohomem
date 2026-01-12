import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Extrai o ID do vídeo de uma URL do YouTube
const extractYouTubeId = (url: string): string => {
  if (!url) return "";
  
  // Se já for apenas o ID (11 caracteres alfanuméricos)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  // Padrões de URL do YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return url; // Retorna o valor original se não encontrar padrão
};

interface Culto {
  id: string;
  title: string;
  date: string;
  description: string | null;
  summary: string | null;
  video_id: string | null;
  thumbnail_url: string | null;
  teachings: string[] | null;
  published: boolean | null;
}

const AdminCultos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCulto, setEditingCulto] = useState<Culto | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    summary: "",
    video_id: "",
    thumbnail_url: "",
    teachings: "",
    published: true,
  });

  const queryClient = useQueryClient();

  const { data: cultos, isLoading } = useQuery({
    queryKey: ["admin-cultos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cultos")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data as Culto[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Culto, "id">) => {
      const { error } = await supabase.from("cultos").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cultos"] });
      toast.success("Culto criado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao criar culto: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Culto> & { id: string }) => {
      const { error } = await supabase.from("cultos").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cultos"] });
      toast.success("Culto atualizado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar culto: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cultos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cultos"] });
      toast.success("Culto removido com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover culto: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      description: "",
      summary: "",
      video_id: "",
      thumbnail_url: "",
      teachings: "",
      published: true,
    });
    setEditingCulto(null);
  };

  const handleEdit = (culto: Culto) => {
    setEditingCulto(culto);
    // Reconstrói a URL completa do YouTube se houver video_id
    const videoUrl = culto.video_id 
      ? `https://www.youtube.com/watch?v=${culto.video_id}` 
      : "";
    setFormData({
      title: culto.title,
      date: culto.date,
      description: culto.description || "",
      summary: culto.summary || "",
      video_id: videoUrl,
      thumbnail_url: culto.thumbnail_url || "",
      teachings: culto.teachings?.join("\n") || "",
      published: culto.published ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extrai o ID do vídeo da URL
    const videoId = extractYouTubeId(formData.video_id);
    
    const data = {
      title: formData.title,
      date: formData.date,
      description: formData.description || null,
      summary: formData.summary || null,
      video_id: videoId || null,
      thumbnail_url: formData.thumbnail_url || null,
      teachings: formData.teachings ? formData.teachings.split("\n").filter(Boolean) : null,
      published: formData.published,
    };

    if (editingCulto) {
      updateMutation.mutate({ id: editingCulto.id, ...data });
    } else {
      createMutation.mutate(data as Omit<Culto, "id">);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este culto?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Cultos
          </h1>
          <p className="font-body text-muted-foreground mt-2">
            Gerencie os cultos do site
          </p>
        </div>
        <Button
          variant="gold"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Culto
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="font-ui text-muted-foreground">Carregando...</p>
        </div>
      ) : cultos?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-body text-muted-foreground">
            Nenhum culto cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cultos?.map((culto) => (
            <div
              key={culto.id}
              className="bg-card rounded-xl p-6 shadow-card border border-border flex items-center gap-4"
            >
              {culto.thumbnail_url && (
                <img
                  src={culto.thumbnail_url}
                  alt={culto.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {culto.title}
                </h3>
                <p className="font-ui text-sm text-muted-foreground">
                  {new Date(culto.date).toLocaleDateString("pt-BR")}
                </p>
                {!culto.published && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs font-ui rounded">
                    Rascunho
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(culto)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(culto.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCulto ? "Editar Culto" : "Novo Culto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="video_id">Link do Vídeo (YouTube)</Label>
                <Input
                  id="video_id"
                  value={formData.video_id}
                  onChange={(e) => setFormData({ ...formData, video_id: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Resumo do Culto</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teachings">Principais Ensinamentos (um por linha)</Label>
              <Textarea
                id="teachings"
                value={formData.teachings}
                onChange={(e) => setFormData({ ...formData, teachings: e.target.value })}
                rows={4}
                placeholder="Primeiro ensinamento&#10;Segundo ensinamento&#10;Terceiro ensinamento"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Publicado</Label>
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="gold"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? "Salvando..." 
                  : editingCulto ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCultos;

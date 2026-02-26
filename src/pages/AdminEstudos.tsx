import { useState } from "react";
import { parseLocalDate } from "@/lib/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Estudo {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string | null;
  content: string | null;
  published: boolean | null;
}

const AdminEstudos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEstudo, setEditingEstudo] = useState<Estudo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    date: "",
    excerpt: "",
    content: "",
    published: true,
  });

  const queryClient = useQueryClient();

  const { data: estudos, isLoading } = useQuery({
    queryKey: ["admin-estudos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estudos")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data as Estudo[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Estudo, "id">) => {
      const { error } = await supabase.from("estudos").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-estudos"] });
      toast.success("Estudo criado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao criar estudo: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Estudo> & { id: string }) => {
      const { error } = await supabase.from("estudos").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-estudos"] });
      toast.success("Estudo atualizado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar estudo: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("estudos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-estudos"] });
      toast.success("Estudo removido com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover estudo: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      date: "",
      excerpt: "",
      content: "",
      published: true,
    });
    setEditingEstudo(null);
  };

  const handleEdit = (estudo: Estudo) => {
    setEditingEstudo(estudo);
    setFormData({
      title: estudo.title,
      author: estudo.author,
      date: estudo.date,
      excerpt: estudo.excerpt || "",
      content: estudo.content || "",
      published: estudo.published ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title: formData.title,
      author: formData.author,
      date: formData.date,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      published: formData.published,
    };

    if (editingEstudo) {
      updateMutation.mutate({ id: editingEstudo.id, ...data });
    } else {
      createMutation.mutate(data as Omit<Estudo, "id">);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este estudo?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Estudos Bíblicos
          </h1>
          <p className="font-body text-muted-foreground mt-2">
            Gerencie os estudos bíblicos do site
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
          Novo Estudo
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="font-ui text-muted-foreground">Carregando...</p>
        </div>
      ) : estudos?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-body text-muted-foreground">
            Nenhum estudo cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {estudos?.map((estudo) => (
            <div
              key={estudo.id}
              className="bg-card rounded-xl p-6 shadow-card border border-border flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {estudo.title}
                </h3>
                <p className="font-ui text-sm text-muted-foreground">
                  {estudo.author} • {parseLocalDate(estudo.date).toLocaleDateString("pt-BR")}
                </p>
                {!estudo.published && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs font-ui rounded">
                    Rascunho
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(estudo)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(estudo.id)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingEstudo ? "Editar Estudo" : "Novo Estudo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="Breve descrição do estudo..."
              />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Escreva o conteúdo do estudo aqui..."
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
              <Button type="submit" variant="gold">
                {editingEstudo ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEstudos;

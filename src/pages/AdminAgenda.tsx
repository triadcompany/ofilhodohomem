import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Calendar, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  event: string;
  is_highlight: boolean | null;
  order_index: number | null;
}

const AdminAgenda = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    day: "",
    time: "",
    event: "",
    is_highlight: false,
  });

  const queryClient = useQueryClient();

  const { data: scheduleItems, isLoading } = useQuery({
    queryKey: ["admin-schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as ScheduleItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<ScheduleItem, "id" | "order_index">) => {
      const maxOrder = scheduleItems?.reduce((max, item) => 
        Math.max(max, item.order_index || 0), 0) || 0;
      const { error } = await supabase.from("schedule").insert([{
        ...data,
        order_index: maxOrder + 1
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedule"] });
      toast.success("Evento criado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao criar evento: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ScheduleItem> & { id: string }) => {
      const { error } = await supabase.from("schedule").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedule"] });
      toast.success("Evento atualizado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar evento: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schedule").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedule"] });
      toast.success("Evento removido com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover evento: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      day: "",
      time: "",
      event: "",
      is_highlight: false,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({
      day: item.day,
      time: item.time,
      event: item.event,
      is_highlight: item.is_highlight ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      day: formData.day,
      time: formData.time,
      event: formData.event,
      is_highlight: formData.is_highlight,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este evento?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Agenda
          </h1>
          <p className="font-body text-muted-foreground mt-2">
            Gerencie os horários dos cultos e eventos
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
          Novo Evento
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="font-ui text-muted-foreground">Carregando...</p>
        </div>
      ) : scheduleItems?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-body text-muted-foreground">
            Nenhum evento cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {scheduleItems?.map((item) => (
            <div
              key={item.id}
              className={`bg-card rounded-xl p-4 shadow-card border flex items-center gap-4 ${
                item.is_highlight ? "border-accent" : "border-border"
              }`}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              <div className="w-16 text-center shrink-0">
                <span className="font-display text-sm font-semibold text-primary">
                  {item.day}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-body text-foreground font-medium">{item.event}</p>
                <p className="font-ui text-sm text-muted-foreground">{item.time}</p>
              </div>
              {item.is_highlight && (
                <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-ui rounded">
                  Destaque
                </span>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingItem ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Dia *</Label>
                <Input
                  id="day"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  placeholder="DOM, SEG, TER..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário *</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="19:00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Evento *</Label>
              <Input
                id="event"
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                placeholder="Culto da Noite"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_highlight"
                checked={formData.is_highlight}
                onCheckedChange={(checked) => setFormData({ ...formData, is_highlight: checked })}
              />
              <Label htmlFor="is_highlight">Destacar como "Hoje"</Label>
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="gold">
                {editingItem ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAgenda;

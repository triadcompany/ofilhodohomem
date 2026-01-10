import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Video, BookOpen, Calendar, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { data: cultosCount } = useQuery({
    queryKey: ["admin-cultos-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("cultos")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: estudosCount } = useQuery({
    queryKey: ["admin-estudos-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("estudos")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: scheduleCount } = useQuery({
    queryKey: ["admin-schedule-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("schedule")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const stats = [
    {
      name: "Cultos",
      value: cultosCount ?? 0,
      icon: Video,
      color: "bg-blue-500",
    },
    {
      name: "Estudos Bíblicos",
      value: estudosCount ?? 0,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      name: "Eventos na Agenda",
      value: scheduleCount ?? 0,
      icon: Calendar,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="font-body text-muted-foreground mt-2">
          Visão geral do conteúdo do site
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-card rounded-xl p-6 shadow-card border border-border"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-ui text-sm text-muted-foreground">{stat.name}</p>
                <p className="font-display text-3xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Ações Rápidas
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/cultos"
            className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-accent/10 transition-colors"
          >
            <Video className="w-5 h-5 text-accent" />
            <span className="font-ui text-sm">Adicionar Culto</span>
          </a>
          <a
            href="/admin/estudos"
            className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-accent/10 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="font-ui text-sm">Novo Estudo</span>
          </a>
          <a
            href="/admin/agenda"
            className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-accent/10 transition-colors"
          >
            <Calendar className="w-5 h-5 text-accent" />
            <span className="font-ui text-sm">Editar Agenda</span>
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-accent/10 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="font-ui text-sm">Ver Site</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

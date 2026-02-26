import { useQuery } from "@tanstack/react-query";
import { parseLocalDate } from "@/lib/dateUtils";
import { supabase } from "@/integrations/supabase/client";
import { Video, BookOpen, Calendar, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

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

  const { data: recentCultos = [] } = useQuery({
    queryKey: ["admin-recent-cultos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cultos")
        .select("id, title, date, published")
        .order("date", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const stats = [
    {
      name: "Cultos",
      value: cultosCount ?? 0,
      icon: Video,
      gradient: "from-primary to-secondary",
      link: "/admin/cultos",
    },
    {
      name: "Estudos Bíblicos",
      value: estudosCount ?? 0,
      icon: BookOpen,
      gradient: "from-secondary to-primary",
      link: "/admin/estudos",
    },
    {
      name: "Eventos na Agenda",
      value: scheduleCount ?? 0,
      icon: Calendar,
      gradient: "from-accent/80 to-accent",
      link: "/admin/agenda",
    },
  ];

  const quickActions = [
    { name: "Novo Culto", icon: Video, link: "/admin/cultos", color: "text-primary" },
    { name: "Novo Estudo", icon: BookOpen, link: "/admin/estudos", color: "text-secondary" },
    { name: "Editar Agenda", icon: Calendar, link: "/admin/agenda", color: "text-accent" },
    { name: "Ver Site", icon: TrendingUp, link: "/", external: true, color: "text-muted-foreground" },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-10"
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="font-body text-muted-foreground mt-1">
          Visão geral do conteúdo do site
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid md:grid-cols-3 gap-5 mb-10"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {stats.map((stat, i) => (
          <motion.div key={stat.name} variants={fadeIn} custom={i}>
            <Link
              to={stat.link}
              className="group block bg-card rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="font-ui text-sm text-muted-foreground">{stat.name}</p>
              <p className="font-display text-4xl font-bold text-foreground mt-1">
                {stat.value}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={3}
          className="lg:col-span-3 bg-card rounded-2xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Cultos Recentes</h2>
              <p className="font-ui text-xs text-muted-foreground mt-0.5">Últimos cultos adicionados</p>
            </div>
            <Link to="/admin/cultos">
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent gap-1">
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCultos.map((culto) => (
              <Link
                key={culto.id}
                to="/admin/cultos"
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-ui text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                    {culto.title}
                  </p>
                  <p className="font-ui text-xs text-muted-foreground mt-0.5">
                    {parseLocalDate(culto.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider ${
                  culto.published
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {culto.published ? "Publicado" : "Rascunho"}
                </span>
              </Link>
            ))}
            {recentCultos.length === 0 && (
              <div className="px-6 py-8 text-center text-muted-foreground font-ui text-sm">
                Nenhum culto cadastrado ainda.
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={4}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-6"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Ações Rápidas</h2>
          <p className="font-ui text-xs text-muted-foreground mb-5">Acesse rapidamente</p>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Tag = action.external ? "a" : Link;
              const props = action.external
                ? { href: action.link, target: "_blank", rel: "noopener noreferrer" }
                : { to: action.link };
              return (
                <Tag
                  key={action.name}
                  {...(props as any)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:scale-105 transition-transform">
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="font-ui text-sm font-medium text-foreground flex-1">{action.name}</span>
                  <Plus className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:rotate-90 transition-all duration-300" />
                </Tag>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

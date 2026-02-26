import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Home,
  Video,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
  FileText,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: Home },
  { name: "Cultos", path: "/admin/cultos", icon: Video },
  { name: "Estudos Bíblicos", path: "/admin/estudos", icon: BookOpen },
  { name: "Páginas", path: "/admin/paginas", icon: FileText },
  { name: "Galeria Fotos", path: "/admin/fotos", icon: ImageIcon },
  { name: "Agenda", path: "/admin/agenda", icon: Calendar },
  { name: "Configurações", path: "/admin/configuracoes", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-card border-r border-border flex flex-col overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between min-h-[72px]">
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "justify-center w-full" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <span className="font-display text-primary-foreground font-bold text-sm">T</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <h2 className="font-display text-sm font-bold text-foreground truncate">Painel Admin</h2>
              <p className="font-ui text-[11px] text-muted-foreground truncate">Tabernáculo</p>
            </motion.div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className={`${!collapsed ? "mb-2 px-3" : "mb-2 text-center"}`}>
          <span className="font-ui text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
            {collapsed ? "•" : "Menu"}
          </span>
        </div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 rounded-xl transition-all duration-200 font-ui text-sm group ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
              {!collapsed && <span className="truncate">{item.name}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="admin-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        <div className={`pt-4 ${!collapsed ? "px-3" : "text-center"}`}>
          <span className="font-ui text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
            {collapsed ? "•" : "Links"}
          </span>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 rounded-xl transition-colors font-ui text-sm text-muted-foreground hover:bg-muted hover:text-foreground ${
            collapsed ? "justify-center p-3" : "px-4 py-3"
          }`}
          title={collapsed ? "Ver Site" : undefined}
        >
          <ExternalLink className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Ver Site</span>}
        </a>
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-border">
        {!collapsed && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-muted/50">
            <p className="font-ui text-[10px] text-muted-foreground uppercase tracking-wider">Logado como</p>
            <p className="font-ui text-xs text-foreground truncate font-medium mt-0.5">
              {user?.email}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={`w-full gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl ${
            collapsed ? "justify-center px-3" : "justify-start"
          }`}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;

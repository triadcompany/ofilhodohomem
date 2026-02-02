import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Video, 
  BookOpen, 
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: Home },
  { name: "Cultos", path: "/admin/cultos", icon: Video },
  { name: "Estudos Bíblicos", path: "/admin/estudos", icon: BookOpen },
  { name: "Páginas", path: "/admin/paginas", icon: FileText },
  { name: "Agenda", path: "/admin/agenda", icon: Calendar },
  { name: "Configurações", path: "/admin/configuracoes", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-primary text-primary-foreground flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <span className="font-display text-accent-foreground font-bold">T</span>
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold">Painel Admin</h2>
            <p className="font-ui text-xs text-primary-foreground/60">Tabernáculo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-ui text-sm ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}

        {/* View Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-ui text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground mt-4"
        >
          <ExternalLink className="w-5 h-5" />
          Ver Site
        </a>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-primary-foreground/10">
        <div className="mb-3 px-4">
          <p className="font-ui text-xs text-primary-foreground/60">Logado como:</p>
          <p className="font-ui text-sm text-primary-foreground truncate">
            {user?.email}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

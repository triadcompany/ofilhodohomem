import { Link, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { Menu, X, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useMenuPages } from "@/hooks/usePages";
import logoImage from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  name: string;
  path: string;
  submenu?: { name: string; path: string }[];
}

const staticNavLinks: NavLink[] = [
  { name: "Início", path: "/" },
  { name: "Cultos", path: "/cultos" },
  { name: "Estudos Bíblicos", path: "/estudos" },
  { name: "Sobre", path: "/sobre" },
  { name: "Contato", path: "/contato" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { config } = useSiteConfig();
  const { data: dynamicPages = [] } = useMenuPages();

  // Build navigation links with dynamic pages
  const navLinks = useMemo(() => {
    const links: NavLink[] = [...staticNavLinks];
    
    // Group dynamic pages by parent_menu
    const groupedPages: Record<string, { name: string; path: string }[]> = {};
    const standalonePages: { name: string; path: string }[] = [];

    dynamicPages.forEach((page) => {
      if (page.parent_menu) {
        if (!groupedPages[page.parent_menu]) {
          groupedPages[page.parent_menu] = [];
        }
        groupedPages[page.parent_menu].push({
          name: page.title,
          path: `/pagina/${page.slug}`,
        });
      } else {
        standalonePages.push({
          name: page.title,
          path: `/pagina/${page.slug}`,
        });
      }
    });

    // Insert grouped pages as dropdown menus after "Estudos Bíblicos"
    const insertIndex = links.findIndex((l) => l.name === "Estudos Bíblicos") + 1;
    
    Object.entries(groupedPages).forEach(([menuName, subPages], idx) => {
      links.splice(insertIndex + idx, 0, {
        name: menuName,
        path: `#${menuName}`,
        submenu: subPages,
      });
    });

    // Add standalone pages before "Sobre"
    standalonePages.forEach((page) => {
      const sobreIndex = links.findIndex((l) => l.name === "Sobre");
      if (sobreIndex !== -1) {
        links.splice(sobreIndex, 0, page);
      } else {
        links.push(page);
      }
    });

    return links;
  }, [dynamicPages]);

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isSubmenuActive = (submenu: { name: string; path: string }[]) => {
    return submenu.some((item) => location.pathname === item.path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoImage}
              alt={`${config.church_name} logo`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <h1 className="font-display text-primary-foreground text-sm font-semibold tracking-wide">
                {config.church_name}
              </h1>
              <p className="font-display text-accent text-xs tracking-wider">
                {config.church_subtitle}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.submenu ? (
                <DropdownMenu key={link.path}>
                  <DropdownMenuTrigger
                    className={`font-ui text-sm tracking-wide transition-colors duration-300 flex items-center gap-1 outline-none ${
                      isSubmenuActive(link.submenu)
                        ? "text-accent font-medium"
                        : "text-primary-foreground/80 hover:text-accent"
                    }`}
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border">
                    {link.submenu.map((sublink) => (
                      <DropdownMenuItem key={sublink.path} asChild>
                        <Link
                          to={sublink.path}
                          className={`w-full cursor-pointer ${
                            location.pathname === sublink.path
                              ? "text-accent font-medium"
                              : ""
                          }`}
                        >
                          {sublink.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-ui text-sm tracking-wide transition-colors duration-300 ${
                    location.pathname === link.path
                      ? "text-accent font-medium"
                      : "text-primary-foreground/80 hover:text-accent"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* Live Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/ao-vivo">
              <Button variant="gold" size="default" className="gap-2">
                <Play className="w-4 h-4" />
                Ao Vivo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-primary-foreground/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.submenu ? (
                  <div key={link.path}>
                    <button
                      onClick={() => toggleSubmenu(link.name)}
                      className={`font-ui text-sm py-2 transition-colors flex items-center gap-1 w-full ${
                        isSubmenuActive(link.submenu)
                          ? "text-accent font-medium"
                          : "text-primary-foreground/80"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openSubmenus[link.name] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSubmenus[link.name] && (
                      <div className="pl-4 flex flex-col gap-2 mt-2">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.path}
                            to={sublink.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`font-ui text-sm py-1 transition-colors ${
                              location.pathname === sublink.path
                                ? "text-accent font-medium"
                                : "text-primary-foreground/70"
                            }`}
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-ui text-sm py-2 transition-colors ${
                      location.pathname === link.path
                        ? "text-accent font-medium"
                        : "text-primary-foreground/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <Link to="/ao-vivo" onClick={() => setIsMenuOpen(false)}>
                <Button variant="gold" size="default" className="w-full gap-2">
                  <Play className="w-4 h-4" />
                  Ao Vivo
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

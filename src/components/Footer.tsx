import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const Footer = () => {
  const { config } = useSiteConfig();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <span className="font-display text-accent-foreground text-lg font-bold">
                  {config.church_name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wide">
                  {config.church_name}
                </h3>
                <p className="font-display text-accent text-xs tracking-wider">
                  {config.church_subtitle}
                </p>
              </div>
            </div>
            <p className="font-body text-primary-foreground/70 text-sm leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-accent text-sm font-semibold tracking-wider mb-6">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {["Início", "Cultos", "Estudos Bíblicos", "Sobre", "Ao Vivo"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link === "Início" ? "" : link.toLowerCase().replace(/ /g, "-").replace("á", "a")}`}
                    className="font-ui text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-accent text-sm font-semibold tracking-wider mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span className="font-ui text-sm text-primary-foreground/70">
                  {config.address_line1}<br />
                  {config.address_line2}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="font-ui text-sm text-primary-foreground/70">
                  {config.phone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="font-ui text-sm text-primary-foreground/70">
                  {config.email}
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-accent text-sm font-semibold tracking-wider mb-6">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {config.facebook_url && (
                <a
                  href={config.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground" />
                </a>
              )}
              {config.instagram_url && (
                <a
                  href={config.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground" />
                </a>
              )}
              {config.youtube_url && (
                <a
                  href={config.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors group"
                >
                  <Youtube className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground" />
                </a>
              )}
              {!config.facebook_url && !config.instagram_url && !config.youtube_url && (
                <>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Facebook className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Instagram className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Youtube className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="font-ui text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} {config.church_name} {config.church_subtitle}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const Footer = () => {
  const { config } = useSiteConfig();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-primary text-primary-foreground relative">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent" />

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
                    className="font-ui text-sm text-primary-foreground/70 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 h-0.5 bg-accent group-hover:w-3 transition-all duration-300" />
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
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="font-ui text-sm text-primary-foreground/70">
                  {config.address_line1}<br />
                  {config.address_line2}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span className="font-ui text-sm text-primary-foreground/70">{config.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span className="font-ui text-sm text-primary-foreground/70">{config.email}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-accent text-sm font-semibold tracking-wider mb-6">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {[
                { url: config.facebook_url, Icon: Facebook },
                { url: config.instagram_url, Icon: Instagram },
                { url: config.youtube_url, Icon: Youtube },
              ].map(({ url, Icon }, i) => (
                <a
                  key={i}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex items-center justify-between">
          <p className="font-ui text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} {config.church_name} {config.church_subtitle}. Todos os direitos reservados.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-300 group"
          >
            <ArrowUp className="w-4 h-4 text-primary-foreground group-hover:text-accent-foreground transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

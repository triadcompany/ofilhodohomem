import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <span className="font-display text-accent-foreground text-lg font-bold">T</span>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wide">
                  Tabernáculo
                </h3>
                <p className="font-display text-accent text-xs tracking-wider">
                  O Filho do Homem
                </p>
              </div>
            </div>
            <p className="font-body text-primary-foreground/70 text-sm leading-relaxed">
              Uma comunidade de fé dedicada a proclamar a mensagem de Cristo e servir ao próximo com amor.
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
                  Rua Exemplo, 123<br />
                  Centro - Cidade/UF
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="font-ui text-sm text-primary-foreground/70">
                  (00) 00000-0000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="font-ui text-sm text-primary-foreground/70">
                  contato@tabernaculo.com
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
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="font-ui text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Tabernáculo O Filho do Homem. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

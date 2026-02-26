import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  delay?: number;
}

const QuickAccessCard = ({ title, description, icon: Icon, link }: QuickAccessCardProps) => {
  return (
    <Link
      to={link}
      className="group relative block bg-card rounded-2xl p-7 shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50 hover:border-accent/30 overflow-hidden"
    >
      {/* Hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex flex-col gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-500">
          <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-accent text-sm font-ui font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Acessar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default QuickAccessCard;

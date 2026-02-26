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
      className="group relative block bg-card rounded-2xl p-9 shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50 hover:border-accent/30 overflow-hidden"
    >
      {/* Hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex flex-col gap-5">
        <div className="w-18 h-18 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500">
          <Icon className="w-9 h-9 text-primary group-hover:text-accent transition-colors duration-300" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          <p className="font-body text-base text-muted-foreground mt-2 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-accent text-base font-ui font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Acessar
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default QuickAccessCard;

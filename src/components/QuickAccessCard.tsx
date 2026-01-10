import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  delay?: number;
}

const QuickAccessCard = ({ title, description, icon: Icon, link, delay = 0 }: QuickAccessCardProps) => {
  return (
    <Link
      to={link}
      className="group block bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50 hover:border-accent/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
          <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default QuickAccessCard;

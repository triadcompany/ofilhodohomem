import { Play } from "lucide-react";
import { parseLocalDate } from "@/lib/dateUtils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CultoCardProps {
  id: string;
  title: string;
  date: string;
  description?: string | null;
  thumbnail_url?: string | null;
  preacher?: string | null;
  isFeatured?: boolean;
}

const CultoCard = ({ id, title, date, description, thumbnail_url, preacher, isFeatured }: CultoCardProps) => {
  const thumbnail = thumbnail_url || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop";
  const formattedDate = parseLocalDate(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  if (isFeatured) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-elevated group">
        <div className="aspect-video relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-accent-foreground ml-1" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-ui font-medium rounded-full mb-3">
            Último Culto
          </span>
          <h3 className="font-display text-xl md:text-2xl font-semibold text-primary-foreground mb-2">
            {title}
          </h3>
          <p className="font-ui text-sm text-primary-foreground/70 mb-4">{formattedDate}</p>
          <Link to={`/cultos/${id}`}>
            <Button variant="heroOutline" size="default">
              Assistir Agora
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/cultos/${id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
            <Play className="w-6 h-6 text-accent-foreground ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="font-ui text-sm text-muted-foreground mt-2">{formattedDate}</p>
        {preacher && (
          <p className="font-ui text-xs text-accent mt-1">Pregador: {preacher}</p>
        )}
        {description && (
          <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
        )}
      </div>
    </Link>
  );
};

export default CultoCard;

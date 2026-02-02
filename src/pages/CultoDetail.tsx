import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Calendar, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCulto } from "@/hooks/useChurchData";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const CultoDetail = () => {
  const { id } = useParams();
  const { data: culto, isLoading } = useCulto(id || "");

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: culto?.title,
        text: culto?.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-24 pb-4 bg-muted/50">
          <div className="container mx-auto px-4">
            <Skeleton className="h-6 w-32" />
          </div>
        </section>
        <section className="pb-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="aspect-video rounded-xl" />
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-48 mb-8" />
              <Skeleton className="h-24 w-full mb-8" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!culto) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Culto não encontrado</h1>
          <Link to="/cultos">
            <Button variant="gold">Voltar aos Cultos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-muted/50">
        <div className="container mx-auto px-4">
          <Link
            to="/cultos"
            className="inline-flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Cultos
          </Link>
        </div>
      </section>

      {/* Video Section */}
      {culto.video_id && (
        <section className="pb-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-xl overflow-hidden shadow-elevated bg-primary">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${culto.video_id}`}
                  title={culto.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Title and Meta */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
                  {culto.title}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2 font-ui text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(culto.date)}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="default" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>

            {/* Description */}
            {culto.description && (
              <div className="prose prose-lg max-w-none mb-12 prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground">
                <div dangerouslySetInnerHTML={{ __html: culto.description }} />
              </div>
            )}

            {/* Summary Card */}
            {culto.summary && (
              <div className="bg-card rounded-xl p-8 shadow-card border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Resumo do Culto
                  </h2>
                </div>
                <div 
                  className="prose prose-base max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: culto.summary }} 
                />
              </div>
            )}

            {/* Teachings */}
            {culto.teachings && culto.teachings.length > 0 && culto.teachings[0] && (
              <div className="bg-primary/5 rounded-xl p-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Principais Ensinamentos
                </h2>
                <div 
                  className="prose prose-base max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-ol:list-decimal prose-ul:list-disc"
                  dangerouslySetInnerHTML={{ __html: culto.teachings[0] }} 
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CultoDetail;

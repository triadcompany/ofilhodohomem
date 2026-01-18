import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEstudo } from "@/hooks/useChurchData";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const EstudoDetail = () => {
  const { id } = useParams();
  const { data: estudo, isLoading } = useEstudo(id || "");

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: estudo?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-24 pb-4 bg-muted/50">
          <div className="container mx-auto px-4">
            <Skeleton className="h-5 w-40" />
          </div>
        </section>
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Skeleton className="h-10 w-3/4 mb-6" />
              <div className="flex gap-4 mb-12">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-4" />
            </div>
          </div>
        </article>
        <Footer />
      </div>
    );
  }

  if (!estudo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Estudo não encontrado</h1>
          <Link to="/estudos">
            <Button variant="gold">Voltar aos Estudos</Button>
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
            to="/estudos"
            className="inline-flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Estudos
          </Link>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
                {estudo.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2 font-ui text-sm">
                    <User className="w-4 h-4" />
                    {estudo.author}
                  </span>
                  <span className="flex items-center gap-2 font-ui text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(estudo.date)}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {estudo.content?.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="font-display text-xl font-semibold text-foreground mt-8 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.trim().startsWith('1.') || paragraph.trim().startsWith('2.') || paragraph.trim().startsWith('3.') || paragraph.trim().startsWith('4.')) {
                  return (
                    <p key={index} className="font-body text-muted-foreground leading-relaxed ml-4">
                      {paragraph}
                    </p>
                  );
                }
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="font-body text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EstudoDetail;

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEstudo } from "@/hooks/useChurchData";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

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
            <div className="prose prose-lg max-w-none 
              prose-headings:font-display prose-headings:text-foreground 
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-6 prose-h1:border-b prose-h1:border-border prose-h1:pb-3
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 
              prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3 
              prose-p:font-body prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline 
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:italic
              prose-ul:text-muted-foreground prose-ul:my-6 prose-ul:pl-6
              prose-ol:text-muted-foreground prose-ol:my-6 prose-ol:pl-6
              prose-li:marker:text-accent prose-li:mb-3
              prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-muted/30 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:rounded-r-lg
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm 
              prose-pre:bg-muted prose-pre:border prose-pre:border-border
              prose-hr:border-border prose-hr:my-10">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
                  span: ({ style, children }) => <span style={style}>{children}</span>,
                  u: ({ children }) => <u>{children}</u>,
                  mark: ({ children }) => <mark className="bg-accent/30 px-1 rounded">{children}</mark>,
                }}
              >
                {estudo.content || ""}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EstudoDetail;

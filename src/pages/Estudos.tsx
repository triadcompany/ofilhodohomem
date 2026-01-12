import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { Link } from "react-router-dom";
import { User, Calendar, ArrowRight } from "lucide-react";
import { useEstudos } from "@/hooks/useChurchData";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Estudos = () => {
  const { data: estudos = [], isLoading } = useEstudos();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Estudos Bíblicos
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Aprofunde seu conhecimento nas Escrituras com nossos estudos e reflexões
          </p>
        </div>
      </section>

      {/* Studies List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {isLoading ? (
              // Loading state
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl p-8 shadow-card border border-border">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : estudos.length > 0 ? (
              estudos.map((estudo) => (
                <article
                  key={estudo.id}
                  className="bg-card rounded-xl p-8 shadow-card border border-border hover:shadow-elevated transition-shadow duration-300"
                >
                  <Link to={`/estudos/${estudo.id}`} className="block group">
                    <h2 className="font-display text-2xl font-semibold text-foreground group-hover:text-accent transition-colors mb-4">
                      {estudo.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-2 font-ui">
                        <User className="w-4 h-4" />
                        {estudo.author}
                      </span>
                      <span className="flex items-center gap-2 font-ui">
                        <Calendar className="w-4 h-4" />
                        {formatDate(estudo.date)}
                      </span>
                    </div>
                    <p className="font-body text-muted-foreground leading-relaxed mb-4">
                      {estudo.excerpt || "Clique para ler o estudo completo."}
                    </p>
                    <span className="inline-flex items-center gap-2 font-ui text-sm font-medium text-accent">
                      Ler estudo completo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </article>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground">
                  Nenhum estudo bíblico disponível no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Estudos;

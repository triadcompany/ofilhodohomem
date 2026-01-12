import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import CultoCard from "@/components/CultoCard";
import { Button } from "@/components/ui/button";
import { useCultos, useCultosYears } from "@/hooks/useChurchData";
import { Skeleton } from "@/components/ui/skeleton";

const Cultos = () => {
  const { data: years = [], isLoading: yearsLoading } = useCultosYears();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  
  // Set the first year when years are loaded
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const { data: cultos = [], isLoading: cultosLoading } = useCultos(selectedYear);

  const isLoading = yearsLoading || cultosLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Cultos
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Reviva os momentos de adoração e ensino através das gravações dos nossos cultos
          </p>
        </div>
      </section>

      {/* Year Filter */}
      <section className="py-8 bg-muted/50 border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-ui text-sm text-muted-foreground mr-2">Filtrar por ano:</span>
            {yearsLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : years.length > 0 ? (
              years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "gold" : "outline"}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Nenhum ano disponível</span>
            )}
          </div>
        </div>
      </section>

      {/* Cultos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle={selectedYear ? `Ano de ${selectedYear}` : "Todos os cultos"}
            title="Mensagens Disponíveis"
            description={`${cultos.length} culto${cultos.length !== 1 ? "s" : ""} encontrado${cultos.length !== 1 ? "s" : ""}`}
          />
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : cultos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cultos.map((culto) => (
                <CultoCard 
                  key={culto.id} 
                  id={culto.id}
                  title={culto.title}
                  date={culto.date}
                  description={culto.description || undefined}
                  thumbnail_url={culto.thumbnail_url || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-muted-foreground">
                Nenhum culto encontrado para este ano.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cultos;

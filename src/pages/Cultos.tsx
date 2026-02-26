import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import CultoCard from "@/components/CultoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCultos, useCultosYears, useCultosPreachers } from "@/hooks/useChurchData";
import { Skeleton } from "@/components/ui/skeleton";

const Cultos = () => {
  const { data: years = [], isLoading: yearsLoading } = useCultosYears();
  const { data: preachers = [] } = useCultosPreachers();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedPreacher, setSelectedPreacher] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const { data: cultos = [], isLoading: cultosLoading } = useCultos(selectedYear);

  const filteredCultos = cultos
    .filter(c => !selectedPreacher || c.preacher === selectedPreacher)
    .filter(c => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()));

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

      {/* Filters */}
      <section className="py-8 bg-muted/50 border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4 space-y-3">
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
          {preachers.length > 0 && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-ui text-sm text-muted-foreground mr-2">Pregador:</span>
              <Button
                variant={!selectedPreacher ? "gold" : "outline"}
                size="sm"
                onClick={() => setSelectedPreacher(undefined)}
              >
                Todos
              </Button>
              {preachers.map((preacher) => (
                <Button
                  key={preacher}
                  variant={selectedPreacher === preacher ? "gold" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPreacher(preacher)}
                >
                  {preacher}
                </Button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar culto pelo título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cultos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle={selectedYear ? `Ano de ${selectedYear}` : "Todos os cultos"}
            title="Mensagens Disponíveis"
            description={`${filteredCultos.length} culto${filteredCultos.length !== 1 ? "s" : ""} encontrado${filteredCultos.length !== 1 ? "s" : ""}`}
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
          ) : filteredCultos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCultos.map((culto) => (
                <CultoCard 
                  key={culto.id} 
                  id={culto.id}
                  title={culto.title}
                  date={culto.date}
                  description={culto.description || undefined}
                  thumbnail_url={culto.thumbnail_url || undefined}
                  preacher={culto.preacher || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-muted-foreground">
                Nenhum culto encontrado{selectedPreacher ? ` para o pregador ${selectedPreacher}` : ""}.
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

import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import CultoCard from "@/components/CultoCard";
import { Button } from "@/components/ui/button";

// Mock data - in production, this would come from a database
const cultosData: Record<string, Array<{ id: string; title: string; date: string; description: string; thumbnail: string }>> = {
  "2025": [
    {
      id: "1",
      title: "A Fé que Vence o Mundo",
      date: "05 de Janeiro de 2025",
      description: "Uma mensagem poderosa sobre a fé que nos sustenta em tempos difíceis.",
      thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop",
    },
  ],
  "2024": [
    {
      id: "2",
      title: "O Poder da Oração",
      date: "29 de Dezembro de 2024",
      description: "Descubra como a oração transforma vidas e aproxima de Deus.",
      thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=450&fit=crop",
    },
    {
      id: "3",
      title: "Caminhos de Esperança",
      date: "22 de Dezembro de 2024",
      description: "A esperança cristã em meio às tribulações do mundo.",
      thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&h=450&fit=crop",
    },
    {
      id: "4",
      title: "O Natal do Salvador",
      date: "15 de Dezembro de 2024",
      description: "Celebração especial do nascimento de Jesus Cristo.",
      thumbnail: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=450&fit=crop",
    },
    {
      id: "5",
      title: "A Graça Transformadora",
      date: "08 de Dezembro de 2024",
      description: "Como a graça de Deus transforma completamente nossas vidas.",
      thumbnail: "https://images.unsplash.com/photo-1519491050282-cf00c82424df?w=800&h=450&fit=crop",
    },
    {
      id: "6",
      title: "Vivendo em Comunhão",
      date: "01 de Dezembro de 2024",
      description: "A importância da comunhão entre os irmãos na fé.",
      thumbnail: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&h=450&fit=crop",
    },
  ],
};

const years = Object.keys(cultosData).sort((a, b) => Number(b) - Number(a));

const Cultos = () => {
  const [selectedYear, setSelectedYear] = useState<string>(years[0]);

  const cultos = cultosData[selectedYear as keyof typeof cultosData] || [];

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
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "gold" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Cultos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle={`Ano de ${selectedYear}`}
            title="Mensagens Disponíveis"
            description={`${cultos.length} culto${cultos.length !== 1 ? "s" : ""} encontrado${cultos.length !== 1 ? "s" : ""}`}
          />
          {cultos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cultos.map((culto) => (
                <CultoCard key={culto.id} {...culto} />
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

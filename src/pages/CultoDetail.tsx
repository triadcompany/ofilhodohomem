import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Calendar, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// Mock data
const cultosData: Record<string, {
  title: string;
  date: string;
  videoId: string;
  description: string;
  summary: string;
  teachings: string[];
}> = {
  "1": {
    title: "A Fé que Vence o Mundo",
    date: "05 de Janeiro de 2025",
    videoId: "dQw4w9WgXcQ",
    description: "Neste culto especial, exploramos o significado profundo da fé cristã e como ela nos capacita a vencer os desafios do mundo. Baseando-nos em 1 João 5:4, descobrimos que nossa fé não é apenas crença, mas uma força viva que nos conecta ao poder de Deus.",
    summary: "A mensagem central deste culto foi sobre como a fé genuína nos permite superar as adversidades da vida. O pastor destacou três pilares fundamentais: a fé como fundamento, a fé como força, e a fé como vitória. Através de exemplos bíblicos e testemunhos, a congregação foi encorajada a fortalecer sua fé diária.",
    teachings: [
      "A fé verdadeira vai além da crença intelectual - ela transforma nossa vida prática",
      "Vencer o mundo significa não ser dominado por seus valores contrários ao Reino",
      "Nossa fé é sustentada pela comunhão com Deus através da oração e da Palavra",
      "A vitória pela fé é um processo contínuo, não um evento único",
    ],
  },
  "2": {
    title: "O Poder da Oração",
    date: "29 de Dezembro de 2024",
    videoId: "dQw4w9WgXcQ",
    description: "Uma profunda reflexão sobre o papel da oração na vida do cristão e como ela transforma nossa relação com Deus.",
    summary: "Este culto trouxe uma poderosa mensagem sobre a importância da oração como canal de comunicação com Deus. Aprendemos que a oração não é apenas pedidos, mas também adoração, gratidão e submissão à vontade divina.",
    teachings: [
      "A oração é o oxigênio da alma espiritual",
      "Deus ouve todas as orações sinceras",
      "A perseverança na oração produz frutos",
    ],
  },
};

const CultoDetail = () => {
  const { id } = useParams();
  const culto = cultosData[id || ""];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: culto?.title,
        text: culto?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

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
      <section className="pb-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl overflow-hidden shadow-elevated bg-primary">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${culto.videoId}`}
                title={culto.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

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
                    {culto.date}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="default" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-12">
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                {culto.description}
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-card rounded-xl p-8 shadow-card border border-border mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Resumo do Culto
                </h2>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed">
                {culto.summary}
              </p>
            </div>

            {/* Teachings */}
            <div className="bg-primary/5 rounded-xl p-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Principais Ensinamentos
              </h2>
              <ul className="space-y-4">
                {culto.teachings.map((teaching, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-ui text-sm font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <p className="font-body text-muted-foreground pt-1">
                      {teaching}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CultoDetail;

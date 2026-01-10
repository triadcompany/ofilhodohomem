import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { Link } from "react-router-dom";
import { User, Calendar, ArrowRight } from "lucide-react";

const estudosData = [
  {
    id: "1",
    title: "O Sermão do Monte: Bem-Aventuranças",
    author: "Pastor João Silva",
    date: "10 de Janeiro de 2025",
    excerpt: "Um estudo profundo sobre as bem-aventuranças de Jesus em Mateus 5, revelando o caráter do verdadeiro discípulo do Reino.",
    content: `As Bem-Aventuranças representam o coração do ensino de Jesus sobre o caráter daqueles que pertencem ao Reino de Deus. Neste estudo, exploraremos cada uma das oito bem-aventuranças...`,
  },
  {
    id: "2",
    title: "Os Frutos do Espírito Santo",
    author: "Pastor Maria Santos",
    date: "03 de Janeiro de 2025",
    excerpt: "Estudo detalhado sobre Gálatas 5:22-23 e como os frutos do Espírito se manifestam na vida do crente.",
    content: `O apóstolo Paulo nos apresenta uma lista de nove características que devem ser evidentes na vida de todo cristão...`,
  },
  {
    id: "3",
    title: "A Armadura de Deus",
    author: "Pastor João Silva",
    date: "27 de Dezembro de 2024",
    excerpt: "Entendendo cada peça da armadura espiritual descrita em Efésios 6 e sua aplicação prática.",
    content: `Paulo usa a metáfora da armadura romana para descrever os recursos espirituais disponíveis ao cristão...`,
  },
  {
    id: "4",
    title: "Parábolas de Jesus: O Semeador",
    author: "Diácono Pedro Oliveira",
    date: "20 de Dezembro de 2024",
    excerpt: "Análise da parábola do semeador e os diferentes tipos de solo que representam o coração humano.",
    content: `A parábola do semeador é uma das mais importantes parábolas de Jesus, pois Ele mesmo a interpretou...`,
  },
];

const Estudos = () => {
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
            {estudosData.map((estudo) => (
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
                      {estudo.date}
                    </span>
                  </div>
                  <p className="font-body text-muted-foreground leading-relaxed mb-4">
                    {estudo.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 font-ui text-sm font-medium text-accent">
                    Ler estudo completo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Estudos;

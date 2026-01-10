import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Eye, Heart, BookOpen } from "lucide-react";

const values = [
  {
    icon: BookOpen,
    title: "Fidelidade à Palavra",
    description: "Cremos na Bíblia como a Palavra inspirada de Deus e a única regra de fé e prática.",
  },
  {
    icon: Heart,
    title: "Amor ao Próximo",
    description: "Servimos a comunidade com amor, compaixão e generosidade, seguindo o exemplo de Cristo.",
  },
  {
    icon: Target,
    title: "Compromisso com a Verdade",
    description: "Proclamamos a mensagem do Evangelho sem compromissos, mantendo a integridade doutrinária.",
  },
  {
    icon: Eye,
    title: "Adoração Reverente",
    description: "Cultivamos uma adoração que honra a Deus em espírito e em verdade, com reverência e alegria.",
  },
];

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Sobre a Igreja
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Conheça nossa história, missão e os valores que nos guiam
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block font-ui text-xs font-semibold tracking-widest text-accent uppercase mb-3">
                Nossa Trajetória
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                História
              </h2>
            </div>
            <div className="bg-card rounded-xl p-8 md:p-12 shadow-card border border-border">
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                O Tabernáculo O Filho do Homem nasceu do desejo sincero de proclamar a mensagem bíblica em sua plenitude e pureza. Fundada com o propósito de ser um lugar de refúgio espiritual e ensino da Palavra, nossa igreja tem sido um farol de esperança para muitas vidas.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                Ao longo dos anos, temos crescido não apenas em número, mas principalmente em profundidade espiritual. Nossa comunidade é formada por pessoas de todas as idades e origens, unidas pela fé em Jesus Cristo e pelo compromisso com a verdade das Escrituras.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Continuamos firmes em nosso propósito inicial: anunciar que "o Filho do Homem veio buscar e salvar o que se havia perdido" (Lucas 19:10), e vemos diariamente as evidências do amor transformador de Deus em nossa congregação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="bg-card rounded-xl p-8 shadow-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Missão
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Proclamar o Evangelho de Jesus Cristo com fidelidade às Escrituras, fazendo discípulos e edificando vidas através do ensino da Palavra, da comunhão fraterna e do serviço ao próximo.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-card rounded-xl p-8 shadow-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Visão
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Ser uma igreja que reflete o caráter de Cristo, transformando vidas e impactando a sociedade através do amor, da verdade e do poder do Evangelho, alcançando gerações para o Reino de Deus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block font-ui text-xs font-semibold tracking-widest text-accent uppercase mb-3">
              O que nos move
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Nossos Valores
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";

const OInicio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            O Início
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Como tudo começou e os primeiros passos desta jornada de fé
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionTitle
              subtitle="Nossas Raízes"
              title="O Chamado e a Visão"
              align="left"
            />
            
            <div className="prose prose-lg max-w-none">
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                O Tabernáculo O Filho do Homem nasceu de um profundo chamado de Deus 
                e de um coração disposto a servir. Com fé e determinação, demos os 
                primeiros passos nesta caminhada.
              </p>
              
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Nos primeiros dias, reuníamos um pequeno grupo de fiéis que 
                compartilhavam o mesmo desejo: viver uma fé autêntica e transformadora.
              </p>

              <div className="bg-muted/50 rounded-xl p-8 my-8">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  Os Primeiros Passos
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Com humildade e confiança em Deus, iniciamos nossa jornada. 
                  As primeiras reuniões eram simples, mas cheias da presença do 
                  Espírito Santo. Cada pessoa que chegava era acolhida com amor, 
                  e juntos crescíamos na fé e no conhecimento da Palavra.
                </p>
              </div>

              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                A visão sempre foi clara: ser uma igreja que reflete o amor de Cristo, 
                acolhendo a todos e proclamando o evangelho com verdade e graça.
              </p>

              <p className="font-body text-muted-foreground leading-relaxed">
                Olhando para trás, vemos a mão de Deus guiando cada passo. 
                O que começou pequeno floresceu em uma comunidade vibrante de fé, 
                pronta para continuar cumprindo o propósito divino.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OInicio;

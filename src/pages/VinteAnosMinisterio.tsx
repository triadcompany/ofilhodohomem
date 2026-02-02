import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";

const VinteAnosMinisterio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            20 Anos de Ministério
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Duas décadas de fé, amor e dedicação ao serviço do Reino de Deus
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionTitle
              subtitle="Nossa Jornada"
              title="Uma História de Fé e Perseverança"
              align="left"
            />
            
            <div className="prose prose-lg max-w-none">
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Ao longo de 20 anos, o Tabernáculo O Filho do Homem tem sido um lugar de 
                encontro com Deus, onde vidas são transformadas e famílias são restauradas.
              </p>
              
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Nossa trajetória é marcada por momentos de intensa comunhão, milagres 
                testemunhados e uma comunidade que cresce em amor e unidade.
              </p>

              <div className="bg-muted/50 rounded-xl p-8 my-8">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  Marcos Importantes
                </h3>
                <ul className="space-y-3 font-body text-muted-foreground">
                  <li>• Fundação do ministério e primeiras reuniões</li>
                  <li>• Crescimento da comunidade e novas instalações</li>
                  <li>• Início das transmissões online</li>
                  <li>• Expansão do trabalho social e assistencial</li>
                  <li>• Celebração de duas décadas de serviço</li>
                </ul>
              </div>

              <p className="font-body text-muted-foreground leading-relaxed">
                Agradecemos a Deus por cada pessoa que faz parte desta história e por 
                todas as bênçãos derramadas ao longo desses anos. Seguimos em frente, 
                confiantes de que o melhor ainda está por vir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VinteAnosMinisterio;

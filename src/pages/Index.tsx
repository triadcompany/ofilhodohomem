import { Link } from "react-router-dom";
import { Play, Video, BookOpen, Users, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickAccessCard from "@/components/QuickAccessCard";
import ScheduleItem from "@/components/ScheduleItem";
import CultoCard from "@/components/CultoCard";
import SectionTitle from "@/components/SectionTitle";
import { useRecentCultos, useSchedule } from "@/hooks/useChurchData";
import heroImage from "@/assets/hero-church.jpg";

const quickAccessItems = [
  {
    title: "Cultos",
    description: "Acesse as gravações de todos os nossos cultos",
    icon: Video,
    link: "/cultos",
  },
  {
    title: "Estudos Bíblicos",
    description: "Aprofunde seu conhecimento na Palavra",
    icon: BookOpen,
    link: "/estudos",
  },
  {
    title: "Ao Vivo",
    description: "Assista às transmissões em tempo real",
    icon: Radio,
    link: "/ao-vivo",
  },
  {
    title: "Sobre a Igreja",
    description: "Conheça nossa história e propósito",
    icon: Users,
    link: "/sobre",
  },
];

const Index = () => {
  const { data: schedule = [] } = useSchedule();
  const { data: recentCultos = [] } = useRecentCultos(3);
  const featuredCulto = recentCultos[0];
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 gradient-hero" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center pt-20">
          <div className="animate-fade-in">
            <span className="inline-block font-ui text-xs font-semibold tracking-[0.3em] text-accent uppercase mb-6">
              Bem-vindo ao
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-wide mb-6">
              Tabernáculo
              <span className="block text-accent mt-2">O Filho do Homem</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto italic leading-relaxed mb-10">
              "Porque o Filho do Homem veio buscar e salvar o que se havia perdido."
              <span className="block text-sm mt-2 text-accent not-italic">Lucas 19:10</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ao-vivo">
                <Button variant="hero" size="xl" className="gap-3">
                  <Play className="w-5 h-5" />
                  Assistir Culto ao Vivo
                </Button>
              </Link>
              <Link to="/cultos">
                <Button variant="heroOutline" size="xl">
                  Ver Cultos Anteriores
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-accent rounded-full" />
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Acesso Rápido"
            title="O que você procura?"
            description="Navegue facilmente por nossos principais conteúdos"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessItems.map((item, index) => (
              <QuickAccessCard key={item.title} {...item} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Culto Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle
                subtitle="Destaque"
                title="Último Culto Publicado"
                align="left"
              />
              <CultoCard
                id="1"
                title="A Fé que Vence o Mundo"
                date="2025-01-05"
                description="Uma mensagem poderosa sobre a fé que nos sustenta em tempos difíceis e nos leva à vitória em Cristo."
                thumbnail_url="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&h=675&fit=crop"
                isFeatured
              />
            </div>
            <div>
              <SectionTitle
                subtitle="Programação"
                title="Agenda Semanal"
                align="left"
              />
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <ScheduleItem key={index} {...item} />
                ))}
              </div>
              <div className="mt-8">
                <Link to="/contato">
                  <Button variant="petroleum" size="lg" className="w-full sm:w-auto">
                    Ver Endereço Completo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cultos Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Cultos Recentes"
            title="Reviva os Momentos de Adoração"
            description="Assista às mensagens mais recentes e alimente sua fé"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentCultos.map((culto) => (
              <CultoCard key={culto.id} {...culto} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/cultos">
              <Button variant="gold" size="lg">
                Ver Todos os Cultos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-6">
            Venha nos Visitar
          </h2>
          <p className="font-body text-lg text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Você é sempre bem-vindo em nossa comunidade. Junte-se a nós em nossos cultos e celebre a fé.
          </p>
          <Link to="/contato">
            <Button variant="gold" size="xl">
              Como Chegar
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

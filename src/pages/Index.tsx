import { Link } from "react-router-dom";
import { Play, Video, BookOpen, Users, Radio, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickAccessCard from "@/components/QuickAccessCard";
import ScheduleItem from "@/components/ScheduleItem";
import CultoCard from "@/components/CultoCard";
import SectionTitle from "@/components/SectionTitle";
import { useRecentCultos, useSchedule } from "@/hooks/useChurchData";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import heroImageDefault from "@/assets/hero-church.jpg";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Index = () => {
  const { data: schedule = [] } = useSchedule();
  const { data: recentCultos = [] } = useRecentCultos(3);
  const { config } = useSiteConfig();
  const featuredCulto = recentCultos[0];
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroImage = config.hero_image_url || heroImageDefault;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url(${heroImage})`, y: heroY }}
        />
        <div className="absolute inset-0 gradient-hero" />

        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4 text-center pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              custom={0}
              className="inline-block font-ui text-xs font-semibold tracking-[0.3em] text-accent uppercase mb-6"
            >
              {config.hero_welcome_text}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-wide mb-6"
            >
              {config.hero_title}
              <span className="block text-accent mt-2">{config.hero_subtitle}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              custom={2}
              className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto italic leading-relaxed mb-10"
            >
              "{config.hero_verse}"
              <span className="block text-sm mt-2 text-accent not-italic">{config.hero_verse_reference}</span>
            </motion.p>
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/ao-vivo">
                <Button variant="hero" size="xl" className="gap-3 group">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Assistir Culto ao Vivo
                </Button>
              </Link>
              <Link to="/cultos">
                <Button variant="heroOutline" size="xl" className="group">
                  Ver Cultos Anteriores
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-accent rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quick Access Section */}
      <section className="py-24 bg-muted/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.05),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <SectionTitle
              subtitle="Acesso Rápido"
              title="O que você procura?"
              description="Navegue facilmente por nossos principais conteúdos"
            />
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {quickAccessItems.map((item, index) => (
              <motion.div key={item.title} variants={fadeInUp} custom={index}>
                <QuickAccessCard {...item} delay={0} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Culto Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -mr-48" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <SectionTitle
                subtitle="Destaque"
                title="Último Culto Publicado"
                align="left"
              />
              {featuredCulto ? (
                <CultoCard
                  id={featuredCulto.id}
                  title={featuredCulto.title}
                  date={featuredCulto.date}
                  description={featuredCulto.description}
                  thumbnail_url={featuredCulto.thumbnail_url}
                  isFeatured
                />
              ) : (
                <div className="text-muted-foreground text-center py-12">
                  Nenhum culto publicado ainda.
                </div>
              )}
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={2}
            >
              <SectionTitle
                subtitle="Programação"
                title="Agenda Semanal"
                align="left"
              />
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    <ScheduleItem {...item} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/contato">
                  <Button variant="petroleum" size="lg" className="w-full sm:w-auto group">
                    Ver Endereço Completo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Cultos Section */}
      <section className="py-24 bg-muted/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.03),transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <SectionTitle
              subtitle="Cultos Recentes"
              title="Reviva os Momentos de Adoração"
              description="Assista às mensagens mais recentes e alimente sua fé"
            />
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {recentCultos.map((culto, i) => (
              <motion.div key={culto.id} variants={fadeInUp} custom={i}>
                <CultoCard {...culto} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/cultos">
              <Button variant="gold" size="lg" className="group">
                Ver Todos os Cultos
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary rounded-full blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="container mx-auto px-4 text-center relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl md:text-5xl font-semibold text-primary-foreground mb-6"
          >
            Venha nos Visitar
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            custom={1}
            className="font-body text-lg text-primary-foreground/70 max-w-xl mx-auto mb-10"
          >
            Você é sempre bem-vindo em nossa comunidade. Junte-se a nós em nossos cultos e celebre a fé.
          </motion.p>
          <motion.div variants={fadeInUp} custom={2}>
            <Link to="/contato">
              <Button variant="gold" size="xl" className="group">
                Como Chegar
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

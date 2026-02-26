import { Link } from "react-router-dom";
import { Play, Video, BookOpen, Users, Radio, ArrowRight, Clock, MapPin, Calendar } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CultoCard from "@/components/CultoCard";
import { useRecentCultos, useSchedule } from "@/hooks/useChurchData";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import heroImageDefault from "@/assets/hero-church.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const quickLinks = [
  { title: "Cultos", desc: "Gravações dos cultos", icon: Video, link: "/cultos", color: "from-primary to-secondary" },
  { title: "Estudos", desc: "Estudos bíblicos", icon: BookOpen, link: "/estudos", color: "from-secondary to-primary" },
  { title: "Ao Vivo", desc: "Transmissão ao vivo", icon: Radio, link: "/ao-vivo", color: "from-accent/80 to-accent" },
  { title: "Sobre", desc: "Nossa história", icon: Users, link: "/sobre", color: "from-primary to-accent/70" },
];

const Index = () => {
  const { data: schedule = [] } = useSchedule();
  const { data: recentCultos = [] } = useRecentCultos(3);
  const { config } = useSiteConfig();
  const featuredCulto = recentCultos[0];
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroImage = config.hero_image_url || heroImageDefault;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url(${heroImage})`, y: heroY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-primary/95" />
        <motion.div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-20 w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[100px]"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4 text-center pt-20">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} custom={0} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 font-ui text-xs font-semibold tracking-widest text-accent uppercase backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {config.hero_welcome_text}
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="font-display text-primary-foreground tracking-tight mb-4 leading-[0.95]"
            >
              <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-primary-foreground/80 mb-2">{config.hero_title}</span>
              <span className="block text-5xl md:text-7xl lg:text-8xl font-bold">{config.hero_subtitle}</span>
            </motion.h1>
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="max-w-lg mx-auto mb-12 p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
            >
              <p className="font-body text-base md:text-lg text-primary-foreground/80 italic leading-relaxed">
                "{config.hero_verse}"
              </p>
              <span className="block text-sm mt-3 text-accent font-ui font-semibold not-italic">{config.hero_verse_reference}</span>
            </motion.div>
            <motion.div variants={fadeInUp} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ao-vivo">
                <Button variant="hero" size="xl" className="gap-3 group rounded-full">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Assistir Culto ao Vivo
                </Button>
              </Link>
              <Link to="/cultos">
                <Button variant="heroOutline" size="xl" className="group rounded-full">
                  Ver Cultos Anteriores
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div className="w-1 h-2 bg-accent rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ─── QUICK ACCESS ─── Horizontal strip */}
      <section className="relative -mt-16 z-10 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            {quickLinks.map((item, i) => (
              <motion.div key={item.title} variants={fadeInUp} custom={i}>
                <Link
                  to={item.link}
                  className="group relative flex flex-col items-center gap-3 p-6 lg:p-8 rounded-2xl bg-card border border-border/60 shadow-elevated hover:shadow-gold transition-all duration-500 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-accent/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <item.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <div className="text-center relative">
                    <h3 className="font-display text-base font-bold text-foreground group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="font-body text-xs text-muted-foreground mt-1 hidden sm:block">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED CULTO — full-width cinematic block ─── */}
      {featuredCulto && (
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-accent/3 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-accent rounded-full" />
                <span className="font-ui text-xs font-semibold tracking-widest text-accent uppercase">Destaque</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} custom={1} className="font-display text-3xl md:text-5xl font-bold text-foreground mb-10">
                Último Culto
              </motion.h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-elevated group"
            >
              <div className="grid lg:grid-cols-5">
                {/* Thumbnail */}
                <div className="lg:col-span-3 relative aspect-video lg:aspect-auto lg:min-h-[420px]">
                  <img
                    src={featuredCulto.thumbnail_url || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop"}
                    alt={featuredCulto.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/80 hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:hidden" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-20 h-20 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-gold cursor-pointer"
                    >
                      <Play className="w-8 h-8 text-accent-foreground ml-1" />
                    </motion.div>
                  </div>
                </div>
                {/* Info */}
                <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center bg-card">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-xs font-ui font-semibold rounded-full w-fit mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featuredCulto.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {featuredCulto.title}
                  </h3>
                  {featuredCulto.description && (
                    <p className="font-body text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {featuredCulto.description}
                    </p>
                  )}
                  <Link to={`/cultos/${featuredCulto.id}`}>
                    <Button variant="gold" size="lg" className="group/btn rounded-full w-full sm:w-auto">
                      Assistir Agora
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── SCHEDULE — modern bento-like ─── */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-10 items-start"
          >
            {/* Left column */}
            <motion.div variants={fadeInUp} className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-accent rounded-full" />
                <span className="font-ui text-xs font-semibold tracking-widest text-accent uppercase">Programação</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Horário dos Cultos
              </h2>
              <p className="font-body text-primary-foreground/60 leading-relaxed mb-8">
                Confira nossos horários e venha participar de nossos encontros.
              </p>
              <Link to="/contato">
                <Button variant="heroOutline" size="lg" className="group rounded-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Como Chegar
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Right column — schedule cards */}
            <motion.div variants={fadeInUp} custom={2} className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
              {schedule.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                    item.is_highlight
                      ? "bg-accent/15 border-accent/30"
                      : "bg-primary-foreground/5 border-primary-foreground/10 hover:border-accent/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.is_highlight ? "bg-accent/20" : "bg-primary-foreground/10"
                    }`}>
                      <Clock className={`w-5 h-5 ${item.is_highlight ? "text-accent" : "text-primary-foreground/60"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold text-primary-foreground">{item.event}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`font-ui text-xs font-semibold ${item.is_highlight ? "text-accent" : "text-primary-foreground/50"}`}>
                          {item.day}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-primary-foreground/30" />
                        <span className="font-ui text-xs text-primary-foreground/50">{item.time}</span>
                      </div>
                    </div>
                  </div>
                  {item.is_highlight && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-ui font-bold rounded-full uppercase tracking-wider">
                      Hoje
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── RECENT CULTOS ─── */}
      <section className="py-24 bg-muted/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,hsl(var(--accent)/0.04),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-accent rounded-full" />
                <span className="font-ui text-xs font-semibold tracking-widest text-accent uppercase">Cultos Recentes</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Reviva os Momentos
              </h2>
              <p className="font-body text-muted-foreground mt-3 max-w-lg leading-relaxed">
                Assista às mensagens mais recentes e alimente sua fé
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} custom={1}>
              <Link to="/cultos">
                <Button variant="gold" size="lg" className="group rounded-full">
                  Ver Todos
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            {recentCultos.map((culto, i) => (
              <motion.div key={culto.id} variants={fadeInUp} custom={i}>
                <CultoCard {...culto} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary via-secondary to-primary py-28">
          <motion.div
            className="absolute -top-20 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="container mx-auto px-4 text-center relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Venha nos Visitar
            </motion.h2>
            <motion.p variants={fadeInUp} custom={1} className="font-body text-lg text-primary-foreground/60 max-w-xl mx-auto mb-10">
              Você é sempre bem-vindo em nossa comunidade. Junte-se a nós em nossos cultos e celebre a fé.
            </motion.p>
            <motion.div variants={fadeInUp} custom={2}>
              <Link to="/contato">
                <Button variant="gold" size="xl" className="group rounded-full shadow-gold">
                  Como Chegar
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

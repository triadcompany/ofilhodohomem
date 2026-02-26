import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Youtube } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Skeleton } from "@/components/ui/skeleton";

const Contato = () => {
  const { config, loading } = useSiteConfig();
  
  const whatsappNumber = config.contact_whatsapp || "5500000000000";
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de mais informações sobre a igreja.");

  const address = config.contact_address || "Rua Exemplo, 123\nBairro Centro\nCidade - Estado, CEP 00000-000";
  const phone = config.contact_phone || "(00) 0000-0000\n(00) 00000-0000";
  const email = config.contact_email || "contato@tabernaculo.com";
  const schedule = config.contact_schedule || "Domingo: 09h e 19h\nQuarta-feira: 19h30\nSexta-feira: 20h";
  const mapUrl = config.contact_map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197506487378!2d-46.65342618502177!3d-23.563079867639347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1635959614825!5m2!1spt-BR!2sbr";

  const facebookUrl = config.contact_facebook_url || "";
  const instagramUrl = config.contact_instagram_url || "";
  const youtubeUrl = config.contact_youtube_url || "";

  const renderMultilineText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Contato
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Entre em contato conosco. Será uma alegria recebê-lo!
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Info Cards */}
            <div className="space-y-6">
              {/* Address */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Endereço
                    </h3>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    ) : (
                      <p className="font-body text-muted-foreground">
                        {renderMultilineText(address)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Telefone
                    </h3>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    ) : (
                      <p className="font-body text-muted-foreground">
                        {renderMultilineText(phone)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      E-mail
                    </h3>
                    {loading ? (
                      <Skeleton className="h-4 w-44" />
                    ) : (
                      <p className="font-body text-muted-foreground">
                        {email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Horários dos Cultos
                    </h3>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ) : (
                      <div className="font-body text-muted-foreground space-y-1">
                        {schedule.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="gold" size="xl" className="w-full gap-3">
                  <MessageCircle className="w-5 h-5" />
                  Fale Conosco pelo WhatsApp
                </Button>
              </a>

              {/* Social Media */}
              {(facebookUrl || instagramUrl || youtubeUrl) && (
                <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Redes Sociais
                  </h3>
                  <div className="flex gap-4">
                    {facebookUrl && (
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-accent transition-colors group"
                      >
                        <Facebook className="w-5 h-5 text-primary group-hover:text-accent-foreground" />
                      </a>
                    )}
                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-accent transition-colors group"
                      >
                        <Instagram className="w-5 h-5 text-primary group-hover:text-accent-foreground" />
                      </a>
                    )}
                    {youtubeUrl && (
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-accent transition-colors group"
                      >
                        <Youtube className="w-5 h-5 text-primary group-hover:text-accent-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="h-[350px] md:h-[500px] lg:h-auto">
              <div className="bg-card rounded-xl shadow-card border border-border h-full overflow-hidden">
                {loading ? (
                  <Skeleton className="w-full h-full min-h-[400px]" />
                ) : (
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização da Igreja"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contato;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Youtube } from "lucide-react";

const Contato = () => {
  const whatsappNumber = "5500000000000";
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de mais informações sobre a igreja.");

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
                    <p className="font-body text-muted-foreground">
                      Rua Exemplo, 123<br />
                      Bairro Centro<br />
                      Cidade - Estado, CEP 00000-000
                    </p>
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
                    <p className="font-body text-muted-foreground">
                      (00) 0000-0000<br />
                      (00) 00000-0000
                    </p>
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
                    <p className="font-body text-muted-foreground">
                      contato@tabernaculo.com
                    </p>
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
                    <div className="font-body text-muted-foreground space-y-1">
                      <p>Domingo: 09h e 19h</p>
                      <p>Quarta-feira: 19h30</p>
                      <p>Sexta-feira: 20h</p>
                    </div>
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
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Redes Sociais
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Facebook className="w-5 h-5 text-primary group-hover:text-accent-foreground" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Instagram className="w-5 h-5 text-primary group-hover:text-accent-foreground" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Youtube className="w-5 h-5 text-primary group-hover:text-accent-foreground" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[600px] lg:h-auto">
              <div className="bg-card rounded-xl shadow-card border border-border h-full overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197506487378!2d-46.65342618502177!3d-23.563079867639347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1635959614825!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Igreja"
                />
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

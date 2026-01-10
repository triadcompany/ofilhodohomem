import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Radio, Calendar, Clock } from "lucide-react";

const schedule = [
  { day: "Domingo", time: "09:00 - 11:00", event: "Culto da Manhã" },
  { day: "Domingo", time: "19:00 - 21:00", event: "Culto da Noite" },
  { day: "Quarta-feira", time: "19:30 - 21:00", event: "Estudo Bíblico" },
  { day: "Sexta-feira", time: "20:00 - 21:30", event: "Culto de Oração" },
];

const AoVivo = () => {
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-8 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isLive && (
              <span className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full font-ui text-sm font-medium animate-pulse">
                <Radio className="w-4 h-4" />
                AO VIVO
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Transmissão ao Vivo
          </h1>
          <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Acompanhe nossos cultos em tempo real, de qualquer lugar
          </p>
        </div>
      </section>

      {/* Player Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isLive ? (
              <div className="aspect-video rounded-xl overflow-hidden shadow-elevated bg-primary">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxx"
                  title="Transmissão ao Vivo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl overflow-hidden shadow-elevated bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
                    <Radio className="w-10 h-10 text-primary-foreground/50" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary-foreground mb-4">
                    Nenhuma transmissão no momento
                  </h2>
                  <p className="font-body text-primary-foreground/70 max-w-md mx-auto mb-6">
                    Aguarde nossos horários de culto ou confira a programação abaixo para saber quando estaremos ao vivo.
                  </p>
                  <Button
                    variant="heroOutline"
                    size="lg"
                    onClick={() => setIsLive(true)}
                    className="opacity-50 cursor-not-allowed"
                  >
                    Aguardando transmissão...
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block font-ui text-xs font-semibold tracking-widest text-accent uppercase mb-3">
                Programação
              </span>
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Horários das Transmissões
              </h2>
            </div>

            <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-5 ${
                    index !== schedule.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {item.event}
                    </h3>
                    <p className="font-ui text-sm text-muted-foreground">
                      {item.day}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-accent">
                    <Clock className="w-4 h-4" />
                    <span className="font-ui text-sm font-medium">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="font-body text-sm text-muted-foreground">
                As transmissões começam aproximadamente 10 minutos antes do horário do culto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AoVivo;

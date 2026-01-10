import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const estudosData: Record<string, {
  title: string;
  author: string;
  date: string;
  content: string;
}> = {
  "1": {
    title: "O Sermão do Monte: Bem-Aventuranças",
    author: "Pastor João Silva",
    date: "10 de Janeiro de 2025",
    content: `
## Introdução

As Bem-Aventuranças representam o coração do ensino de Jesus sobre o caráter daqueles que pertencem ao Reino de Deus. Encontradas em Mateus 5:3-12, estas declarações revolucionárias invertem os valores do mundo e revelam a verdadeira felicidade segundo Deus.

## As Oito Bem-Aventuranças

### 1. Bem-aventurados os pobres de espírito
"Bem-aventurados os pobres de espírito, porque deles é o Reino dos céus." (v.3)

A pobreza de espírito não se refere à pobreza material, mas à humildade espiritual. É reconhecer nossa completa dependência de Deus e nossa incapacidade de nos salvarmos por nossos próprios méritos.

### 2. Bem-aventurados os que choram
"Bem-aventurados os que choram, porque serão consolados." (v.4)

Este choro refere-se à tristeza pelo pecado — tanto o nosso quanto o do mundo. Aqueles que se entristecem genuinamente pelo mal serão consolados pela graça restauradora de Deus.

### 3. Bem-aventurados os mansos
"Bem-aventurados os mansos, porque herdarão a terra." (v.5)

Mansidão não é fraqueza, mas força sob controle. É a capacidade de não retaliar, de confiar a Deus nossa defesa, assim como Jesus fez.

### 4. Bem-aventurados os que têm fome e sede de justiça
"Bem-aventurados os que têm fome e sede de justiça, porque serão fartos." (v.6)

Um desejo intenso pela justiça de Deus — tanto em nós mesmos quanto no mundo — caracteriza o verdadeiro discípulo.

## Aplicação Prática

Como podemos viver as bem-aventuranças no dia a dia?

1. **Cultive a humildade** através da oração e meditação na Palavra
2. **Lamente pelo pecado** e busque a santificação
3. **Pratique a mansidão** em seus relacionamentos
4. **Busque a justiça** em todas as áreas da vida

## Conclusão

As Bem-Aventuranças não são meros ideais inatingíveis, mas o retrato do caráter que o Espírito Santo desenvolve em nós. À medida que crescemos em Cristo, estas qualidades se tornam cada vez mais evidentes em nossas vidas.
    `,
  },
  "2": {
    title: "Os Frutos do Espírito Santo",
    author: "Pastor Maria Santos",
    date: "03 de Janeiro de 2025",
    content: `
## Introdução

O apóstolo Paulo nos apresenta em Gálatas 5:22-23 uma lista de nove características que devem ser evidentes na vida de todo cristão. Estas qualidades são chamadas de "fruto do Espírito" porque são produzidas em nós pelo Espírito Santo.

## O Fruto do Espírito

"Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio."

### Amor (Ágape)
O amor ágape é o amor incondicional, sacrificial, que busca o bem do outro independente de reciprocidade.

### Alegria (Chara)
Uma alegria profunda que não depende das circunstâncias, mas está enraizada na certeza da salvação.

### Paz (Eirene)
A paz que excede todo entendimento, fruto da reconciliação com Deus através de Cristo.

## Conclusão

O fruto do Espírito é singular — não "frutos", mas "fruto". Todas estas qualidades formam um todo integrado que manifesta a vida de Cristo em nós.
    `,
  },
};

const EstudoDetail = () => {
  const { id } = useParams();
  const estudo = estudosData[id || ""];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: estudo?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  if (!estudo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Estudo não encontrado</h1>
          <Link to="/estudos">
            <Button variant="gold">Voltar aos Estudos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-muted/50">
        <div className="container mx-auto px-4">
          <Link
            to="/estudos"
            className="inline-flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Estudos
          </Link>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
                {estudo.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2 font-ui text-sm">
                    <User className="w-4 h-4" />
                    {estudo.author}
                  </span>
                  <span className="flex items-center gap-2 font-ui text-sm">
                    <Calendar className="w-4 h-4" />
                    {estudo.date}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {estudo.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="font-display text-xl font-semibold text-foreground mt-8 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.trim().startsWith('1.') || paragraph.trim().startsWith('2.') || paragraph.trim().startsWith('3.') || paragraph.trim().startsWith('4.')) {
                  return (
                    <p key={index} className="font-body text-muted-foreground leading-relaxed ml-4">
                      {paragraph}
                    </p>
                  );
                }
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="font-body text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EstudoDetail;

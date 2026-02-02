-- Create pages table for dynamic content management
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  section_subtitle TEXT,
  section_title TEXT,
  parent_menu TEXT,
  menu_order INTEGER DEFAULT 0,
  show_in_menu BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Anyone can view published pages
CREATE POLICY "Anyone can view published pages"
ON public.pages
FOR SELECT
USING (published = true);

-- Admins can view all pages
CREATE POLICY "Admins can view all pages"
ON public.pages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert pages
CREATE POLICY "Admins can insert pages"
ON public.pages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update pages
CREATE POLICY "Admins can update pages"
ON public.pages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete pages
CREATE POLICY "Admins can delete pages"
ON public.pages
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pages
INSERT INTO public.pages (title, slug, content, hero_title, hero_subtitle, section_subtitle, section_title, parent_menu, menu_order, published)
VALUES 
  ('20 Anos de Ministério', '20-anos', 
   'Ao longo de 20 anos, o Tabernáculo O Filho do Homem tem sido um lugar de encontro com Deus, onde vidas são transformadas e famílias são restauradas.

Nossa trajetória é marcada por momentos de intensa comunhão, milagres testemunhados e uma comunidade que cresce em amor e unidade.

## Marcos Importantes

- Fundação do ministério e primeiras reuniões
- Crescimento da comunidade e novas instalações
- Início das transmissões online
- Expansão do trabalho social e assistencial
- Celebração de duas décadas de serviço

Agradecemos a Deus por cada pessoa que faz parte desta história e por todas as bênçãos derramadas ao longo desses anos. Seguimos em frente, confiantes de que o melhor ainda está por vir.',
   '20 Anos de Ministério', 
   'Duas décadas de fé, amor e dedicação ao serviço do Reino de Deus',
   'Nossa Jornada',
   'Uma História de Fé e Perseverança',
   'Nossa História', 
   1, 
   true),
  ('O Início', 'o-inicio', 
   'O Tabernáculo O Filho do Homem nasceu de um profundo chamado de Deus e de um coração disposto a servir. Com fé e determinação, demos os primeiros passos nesta caminhada.

Nos primeiros dias, reuníamos um pequeno grupo de fiéis que compartilhavam o mesmo desejo: viver uma fé autêntica e transformadora.

## Os Primeiros Passos

Com humildade e confiança em Deus, iniciamos nossa jornada. As primeiras reuniões eram simples, mas cheias da presença do Espírito Santo. Cada pessoa que chegava era acolhida com amor, e juntos crescíamos na fé e no conhecimento da Palavra.

A visão sempre foi clara: ser uma igreja que reflete o amor de Cristo, acolhendo a todos e proclamando o evangelho com verdade e graça.

Olhando para trás, vemos a mão de Deus guiando cada passo. O que começou pequeno floresceu em uma comunidade vibrante de fé, pronta para continuar cumprindo o propósito divino.',
   'O Início', 
   'Como tudo começou e os primeiros passos desta jornada de fé',
   'Nossas Raízes',
   'O Chamado e a Visão',
   'Nossa História', 
   2, 
   true);

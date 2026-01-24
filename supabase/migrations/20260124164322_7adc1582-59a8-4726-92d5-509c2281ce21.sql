-- Inserir campos para a página Sobre
INSERT INTO public.church_info (key, value) VALUES
  ('about_history', 'O Tabernáculo O Filho do Homem nasceu do desejo sincero de proclamar a mensagem bíblica em sua plenitude e pureza. Fundada com o propósito de ser um lugar de refúgio espiritual e ensino da Palavra, nossa igreja tem sido um farol de esperança para muitas vidas.

Ao longo dos anos, temos crescido não apenas em número, mas principalmente em profundidade espiritual. Nossa comunidade é formada por pessoas de todas as idades e origens, unidas pela fé em Jesus Cristo e pelo compromisso com a verdade das Escrituras.

Continuamos firmes em nosso propósito inicial: anunciar que "o Filho do Homem veio buscar e salvar o que se havia perdido" (Lucas 19:10), e vemos diariamente as evidências do amor transformador de Deus em nossa congregação.'),
  ('about_mission', 'Proclamar o Evangelho de Jesus Cristo com fidelidade às Escrituras, fazendo discípulos e edificando vidas através do ensino da Palavra, da comunhão fraterna e do serviço ao próximo.'),
  ('about_vision', 'Ser uma igreja que reflete o caráter de Cristo, transformando vidas e impactando a sociedade através do amor, da verdade e do poder do Evangelho, alcançando gerações para o Reino de Deus.'),
  ('about_value_1_title', 'Fidelidade à Palavra'),
  ('about_value_1_description', 'Cremos na Bíblia como a Palavra inspirada de Deus e a única regra de fé e prática.'),
  ('about_value_2_title', 'Amor ao Próximo'),
  ('about_value_2_description', 'Servimos a comunidade com amor, compaixão e generosidade, seguindo o exemplo de Cristo.'),
  ('about_value_3_title', 'Compromisso com a Verdade'),
  ('about_value_3_description', 'Proclamamos a mensagem do Evangelho sem compromissos, mantendo a integridade doutrinária.'),
  ('about_value_4_title', 'Adoração Reverente'),
  ('about_value_4_description', 'Cultivamos uma adoração que honra a Deus em espírito e em verdade, com reverência e alegria.')
ON CONFLICT (key) DO NOTHING;

-- Inserir campos para a página Contato
INSERT INTO public.church_info (key, value) VALUES
  ('contact_address', 'Rua Exemplo, 123\nBairro Centro\nCidade - Estado, CEP 00000-000'),
  ('contact_phone', '(00) 0000-0000\n(00) 00000-0000'),
  ('contact_email', 'contato@tabernaculo.com'),
  ('contact_schedule', 'Domingo: 09h e 19h\nQuarta-feira: 19h30\nSexta-feira: 20h'),
  ('contact_whatsapp', '5500000000000'),
  ('contact_facebook_url', ''),
  ('contact_instagram_url', ''),
  ('contact_youtube_url', ''),
  ('contact_map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197506487378!2d-46.65342618502177!3d-23.563079867639347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1635959614825!5m2!1spt-BR!2sbr')
ON CONFLICT (key) DO NOTHING;
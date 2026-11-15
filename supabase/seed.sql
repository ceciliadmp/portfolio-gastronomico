-- =====================================================================
-- Conteúdo de exemplo (opcional). Rode depois do schema.sql.
-- Para recomeçar do zero: delete from photos; delete from categories;
-- =====================================================================

insert into public.settings (id, name, role, tagline, about_title, about_html, about_photo_url, about_photo_path, education, experience, specialties, email, whatsapp, instagram, facebook, tiktok, youtube, linkedin, website) values (1, 'Helena Duarte', 'Chef de cozinha', 'Cozinha autoral brasileira, feita com tempo, técnica e ingredientes de estação.', 'Cozinhar é contar histórias com o que a terra oferece.', '<p>Cresci entre panelas de barro na cozinha da minha avó, em Minas Gerais, e foi ali que aprendi que comida boa começa muito antes do fogão: começa no <strong>respeito ao ingrediente</strong>.</p><p>Depois de anos trabalhando em restaurantes no Brasil e na Europa, voltei para criar uma cozinha <em>autoral, afetiva e contemporânea</em>, que une técnicas clássicas a sabores brasileiros.</p><p>Hoje assino menus para eventos, jantares privados e consultorias para restaurantes.</p>', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80', null, 'Gastronomia — Universidade Anhembi Morumbi (2012)
Cuisine et Pâtisserie — Le Cordon Bleu, Paris (2014)
Curso de Fermentação Natural — Lisboa (2018)', 'Subchef — Restaurante Mesa Viva, São Paulo (2015–2018)
Chef de partie — Maison Laurent, Lyon (2018–2020)
Chef executiva — Casa Tempero, Belo Horizonte (2020–2024)
Chef independente e consultora (desde 2024)', 'Menus degustação
Cozinha mineira contemporânea
Fermentação
Confeitaria de estação
Jantares privados', 'contato@helenaduarte.com.br', '5511999999999', 'https://instagram.com/', '', '', '', 'https://linkedin.com/', '')
on conflict (id) do nothing;

insert into public.categories (id, name, position) values
  ('00000000-0000-4000-8000-000000000001', 'Pratos principais', 0),
  ('00000000-0000-4000-8000-000000000002', 'Sobremesas', 1),
  ('00000000-0000-4000-8000-000000000003', 'Eventos', 2),
  ('00000000-0000-4000-8000-000000000004', 'Bastidores', 3)
on conflict (id) do nothing;

insert into public.photos (title, description, category_id, url, thumb_url, width, height, position) values
  ('Costela ao fogo baixo', 'Doze horas de cocção, purê defumado de mandioquinha e jus reduzido.', '00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=75', 1200, 1500, 0),
  ('Torta de frutas vermelhas', 'Massa sablée, creme de baunilha do Cerrado e frutas da estação.', '00000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=75', 1200, 1600, 1),
  ('Jantar a quatro mãos', 'Menu degustação de sete tempos para 40 convidados.', '00000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=75', 1600, 1067, 2),
  ('Bowl de verão', 'Folhas, grãos tostados, abacate e molho cítrico de maracujá.', '00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=75', 1200, 1200, 3),
  ('Mise en place', 'A calma antes do serviço: tudo pesado, cortado e no lugar.', '00000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=75', 1600, 1067, 4),
  ('Iogurte, mel e frutas', 'Iogurte de leite de cabra, mel de florada silvestre e granola da casa.', '00000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=75', 1200, 1600, 5),
  ('Massa fresca ao pomodoro', 'Tagliatelle feito à mão, tomates assados lentamente e manjericão.', '00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=75', 1200, 1500, 6),
  ('Salão preparado', 'Montagem para um casamento intimista no interior de São Paulo.', '00000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=75', 1600, 1067, 7),
  ('Salmão em crosta de ervas', 'Legumes glaceados na manteiga noisette e flor de sal.', '00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=75', 1200, 1500, 8),
  ('Sorvetes artesanais', 'Pistache, chocolate 70% e morango com pimenta-rosa.', '00000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=75', 1200, 1500, 9),
  ('Bife ancho na brasa', 'Chimichurri de ervas frescas e batatas rústicas.', '00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=75', 1600, 1200, 10),
  ('Mesa posta', 'Experiência gastronômica para uma marca de vinhos.', '00000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=75', 1600, 1067, 11),
  ('Panquecas da manhã', 'Brunch de domingo com frutas frescas e xarope de bordo.', '00000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=75', 1200, 1500, 12),
  ('Teste de receita', 'Cada prato passa por várias versões até chegar ao menu.', '00000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1800&q=80', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=75', 1200, 1500, 13);

// Conteúdo de exemplo (fictício). Substitua tudo pelo painel /admin.
const u = (id) => ({
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`,
  thumb_url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=75`,
})

export const seedCategories = [
  { id: 'cat-pratos', name: 'Pratos principais', position: 0 },
  { id: 'cat-sobremesas', name: 'Sobremesas', position: 1 },
  { id: 'cat-eventos', name: 'Eventos', position: 2 },
  { id: 'cat-bastidores', name: 'Bastidores', position: 3 },
]

const p = (id, img, w, h, category_id, title, description) => ({
  id, ...u(img), width: w, height: h, category_id, title, description, path: null, thumb_path: null,
})

export const seedPhotos = [
  p('ph-1', 'photo-1504674900247-0877df9cc836', 1200, 1500, 'cat-pratos', 'Costela ao fogo baixo', 'Doze horas de cocção, purê defumado de mandioquinha e jus reduzido.'),
  p('ph-2', 'photo-1565958011703-44f9829ba187', 1200, 1600, 'cat-sobremesas', 'Torta de frutas vermelhas', 'Massa sablée, creme de baunilha do Cerrado e frutas da estação.'),
  p('ph-3', 'photo-1414235077428-338989a2e8c0', 1600, 1067, 'cat-eventos', 'Jantar a quatro mãos', 'Menu degustação de sete tempos para 40 convidados.'),
  p('ph-4', 'photo-1546069901-ba9599a7e63c', 1200, 1200, 'cat-pratos', 'Bowl de verão', 'Folhas, grãos tostados, abacate e molho cítrico de maracujá.'),
  p('ph-5', 'photo-1556910103-1c02745aae4d', 1600, 1067, 'cat-bastidores', 'Mise en place', 'A calma antes do serviço: tudo pesado, cortado e no lugar.'),
  p('ph-6', 'photo-1488477181946-6428a0291777', 1200, 1600, 'cat-sobremesas', 'Iogurte, mel e frutas', 'Iogurte de leite de cabra, mel de florada silvestre e granola da casa.'),
  p('ph-7', 'photo-1473093295043-cdd812d0e601', 1200, 1500, 'cat-pratos', 'Massa fresca ao pomodoro', 'Tagliatelle feito à mão, tomates assados lentamente e manjericão.'),
  p('ph-8', 'photo-1555396273-367ea4eb4db5', 1600, 1067, 'cat-eventos', 'Salão preparado', 'Montagem para um casamento intimista no interior de São Paulo.'),
  p('ph-9', 'photo-1519708227418-c8fd9a32b7a2', 1200, 1500, 'cat-pratos', 'Salmão em crosta de ervas', 'Legumes glaceados na manteiga noisette e flor de sal.'),
  p('ph-10', 'photo-1563805042-7684c019e1cb', 1200, 1500, 'cat-sobremesas', 'Sorvetes artesanais', 'Pistache, chocolate 70% e morango com pimenta-rosa.'),
  p('ph-11', 'photo-1600891964599-f61ba0e24092', 1600, 1200, 'cat-pratos', 'Bife ancho na brasa', 'Chimichurri de ervas frescas e batatas rústicas.'),
  p('ph-12', 'photo-1559339352-11d035aa65de', 1600, 1067, 'cat-eventos', 'Mesa posta', 'Experiência gastronômica para uma marca de vinhos.'),
  p('ph-13', 'photo-1567620905732-2d1ec7ab7445', 1200, 1500, 'cat-sobremesas', 'Panquecas da manhã', 'Brunch de domingo com frutas frescas e xarope de bordo.'),
  p('ph-14', 'photo-1512621776951-a57141f2eefd', 1200, 1500, 'cat-bastidores', 'Teste de receita', 'Cada prato passa por várias versões até chegar ao menu.'),
].map((x, i) => ({ ...x, position: i, created_at: new Date(2026, 0, 1 + i).toISOString() }))

export const seedSettings = {
  id: 1,
  name: 'Antônia Ferreira',
  role: 'Chef de cozinha',
  tagline: 'Cozinha autoral brasileira, feita com tempo, técnica e ingredientes de estação.',
  about_title: 'Cozinhar é contar histórias com o que a terra oferece.',
  about_html:
    '<p>Cresci entre panelas de barro na cozinha da minha avó, em Minas Gerais, e foi ali que aprendi que comida boa começa muito antes do fogão: começa no <strong>respeito ao ingrediente</strong>.</p>' +
    '<p>Depois de anos trabalhando em restaurantes no Brasil e na Europa, voltei para criar uma cozinha <em>autoral, afetiva e contemporânea</em>, que une técnicas clássicas a sabores brasileiros.</p>' +
    '<p>Hoje assino menus para eventos, jantares privados e consultorias para restaurantes.</p>',
  about_photo_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
  about_photo_path: null,
  education: 'Gastronomia — Universidade Anhembi Morumbi (2012)\nCuisine et Pâtisserie — Le Cordon Bleu, Paris (2014)\nCurso de Fermentação Natural — Lisboa (2018)',
  experience: 'Subchef — Restaurante Mesa Viva, São Paulo (2015–2018)\nChef de partie — Maison Laurent, Lyon (2018–2020)\nChef executiva — Casa Tempero, Belo Horizonte (2020–2024)\nChef independente e consultora (desde 2024)',
  specialties: 'Menus degustação\nCozinha mineira contemporânea\nFermentação\nConfeitaria de estação\nJantares privados',
  email: 'contato@antoniaferreira.com.br',
  whatsapp: '5511999999999',
  instagram: 'https://instagram.com/',
  facebook: '',
  tiktok: '',
  youtube: '',
  linkedin: 'https://linkedin.com/',
  website: '',
}

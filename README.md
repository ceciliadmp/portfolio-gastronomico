# Portfólio gastronômico

Site de portfólio (galeria em mosaico, sobre mim, contato) + painel `/admin` para editar tudo sem código.
Feito com React + Vite, banco de dados e armazenamento de imagens no **Supabase**.

> **Modo demonstração:** sem o Supabase configurado, o site já funciona com conteúdo de exemplo e
> o painel aceita o login `admin@demo.com` / `demo123`. Nesse modo, as mudanças ficam salvas só no seu navegador.

## Rodar no computador

```bash
npm install
npm run dev
```
Abra http://localhost:5173 (site) e http://localhost:5173/admin (painel).

## Ligar o banco de dados (Supabase) — ~10 minutos

1. Crie uma conta e um projeto gratuito em https://supabase.com.
2. No projeto, vá em **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. (Opcional) Rode também `supabase/seed.sql` para começar com o conteúdo de exemplo.
4. **Crie seu login:** Authentication → Users → *Add user* → informe seu e-mail e senha (marque *Auto Confirm User*).
5. **Feche o cadastro para outras pessoas:** Authentication → Sign In / Providers → desative *Allow new users to sign up*.
6. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public*.
7. Copie `.env.example` para `.env` e cole os dois valores.

## Publicar (Vercel ou Netlify)

1. Suba esta pasta para um repositório no GitHub.
2. Importe o repositório na Vercel (ou Netlify). Build: `npm run build`, pasta de saída: `dist`.
3. Em *Environment Variables*, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Pronto: o painel fica em `https://seu-site.com/admin`. (`vercel.json` e `public/_redirects` já cuidam das rotas.)

## Personalizar

| O quê | Onde |
|---|---|
| Nome, frase, fotos, categorias, sobre mim, contatos | No painel `/admin` |
| Texto do link compartilhado (WhatsApp/Instagram) | `index.html` — tags `<title>`, `description` e `og:*` |
| Imagem de pré-visualização do link | Substitua `public/og-image.jpg` (1200×630 px) — idealmente sua melhor foto |
| Cor de destaque e fonte | `src/styles.css`, no topo (`--accent`, `--font`) |
| Conteúdo de exemplo | `src/lib/seed.js` |

Observação: o WhatsApp e o Instagram leem a pré-visualização direto do `index.html` (não executam o site),
por isso esses textos ficam fixos ali e não no painel.

## Como funciona

- **Imagens:** ao enviar, cada foto é redimensionada (máx. 2000 px) e convertida para WebP no próprio navegador,
  gerando também uma miniatura de 800 px para a galeria. A versão grande só carrega no modo tela cheia.
- **Segurança:** qualquer pessoa pode *ver* o conteúdo; apenas usuários logados podem *alterar* (regras RLS do Supabase).
- **Ordem:** novas fotos entram no topo da galeria; arraste no painel para reordenar.

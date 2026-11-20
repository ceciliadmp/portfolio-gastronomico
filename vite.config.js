import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Lê nome, profissão e frase do Supabase no momento da publicação, para que
// a pré-visualização do link (WhatsApp, Instagram, Google) mostre o que está no painel.
async function fetchSettings(env) {
  const url = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/settings?id=eq.1&select=name,role,tagline`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const [row] = await res.json()
    return row || null
  } catch (e) {
    console.warn(`[seo] Não foi possível ler o cabeçalho no Supabase (${e.message}); usando os textos do index.html.`)
    return null
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }

  // WhatsApp e redes sociais exigem o endereço COMPLETO da imagem. Na Vercel o
  // domínio é preenchido automaticamente; em outro serviço, defina SITE_URL.
  const siteUrl = (env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  ).replace(/\/$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'seo-meta',
        async transformIndexHtml(html) {
          const s = mode === 'production' ? await fetchSettings(env) : null
          if (s?.name) {
            const title = esc(s.role ? `${s.name} — ${s.role}` : s.name)
            html = html
              .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
              .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
            console.log(`[seo] Título do link: ${s.role ? `${s.name} — ${s.role}` : s.name}`)
          }
          if (s?.tagline) {
            html = html
              .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(s.tagline)}`)
              .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(s.tagline)}`)
          }
          if (siteUrl) {
            html = html
              .replace('content="/og-image.jpg"', `content="${siteUrl}/og-image.jpg"`)
              .replace('<meta property="og:type"', `<meta property="og:url" content="${siteUrl}/" />\n    <meta property="og:type"`)
          }
          return html
        },
      },
    ],
  }
})

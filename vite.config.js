import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WhatsApp, Instagram e Facebook exigem o endereço COMPLETO da imagem de
// pré-visualização. Na Vercel, o domínio do site é preenchido automaticamente;
// em outro serviço, defina SITE_URL (ex.: https://meusite.com.br).
const siteUrl = (process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'absolute-og-urls',
      transformIndexHtml(html) {
        if (!siteUrl) return html
        return html
          .replace('content="/og-image.jpg"', `content="${siteUrl}/og-image.jpg"`)
          .replace('<meta property="og:type"', `<meta property="og:url" content="${siteUrl}/" />\n    <meta property="og:type"`)
      },
    },
  ],
})

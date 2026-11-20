import { useEffect, useState } from 'react'
import { useSiteData, lines } from '../lib/useSiteData'
import { cleanHtml } from '../lib/sanitize'
import { Icon, socialList } from '../lib/icons'
import { reveal } from './reveal'
import Gallery from './Gallery'

function Header({ settings }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap header-inner">
        <a href="#portfolio" className="brand">{settings.name}</a>
        <nav className="nav" aria-label="Menu principal">
          <a href="#portfolio">Portfólio</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>
    </header>
  )
}

function About({ s }) {
  const blocks = [
    ['Formação', lines(s.education)],
    ['Experiência', lines(s.experience)],
  ].filter(([, l]) => l.length)
  const specs = lines(s.specialties)
  return (
    <section id="sobre" className="about">
      <div className="wrap about-grid">
        {s.about_photo_url && (
          <div className="about-photo reveal" ref={reveal}>
            <img src={s.about_photo_url} alt={s.name} loading="lazy" decoding="async" />
          </div>
        )}
        <div className="about-text">
          <p className="eyebrow reveal" ref={reveal}>Sobre mim</p>
          {s.about_title && <h2 className="display reveal" ref={reveal}>{s.about_title}</h2>}
          <div className="prose reveal" ref={reveal} dangerouslySetInnerHTML={{ __html: cleanHtml(s.about_html) }} />
          {blocks.map(([title, items]) => (
            <div className="about-block reveal" ref={reveal} key={title}>
              <h3>{title}</h3>
              <ul className="timeline">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          ))}
          {specs.length > 0 && (
            <div className="about-block reveal" ref={reveal}>
              <h3>Especialidades</h3>
              <ul className="chips">{specs.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Contact({ s }) {
  const wa = (s.whatsapp || '').replace(/\D/g, '')
  const socials = socialList.filter((x) => s[x.key])
  return (
    <section id="contato" className="contact">
      <div className="wrap">
        <p className="eyebrow reveal" ref={reveal}>Contato</p>
        <h2 className="display reveal" ref={reveal}>Vamos criar algo<br />delicioso juntos?</h2>
        <div className="contact-list reveal" ref={reveal}>
          {s.email && (
            <a className="contact-item" href={`mailto:${s.email}`}>
              <Icon.mail /><span><small>E-mail</small>{s.email}</span>
            </a>
          )}
          {wa && (
            <a className="contact-item" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
              <Icon.whatsapp /><span><small>WhatsApp</small>Enviar mensagem</span>
            </a>
          )}
        </div>
        {socials.length > 0 && (
          <div className="socials reveal" ref={reveal}>
            {socials.map(({ key, label, icon: I }) => (
              <a key={key} href={s[key]} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
                <I />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const SECTIONS = [['portfolio', 'Portfólio'], ['sobre', 'Sobre'], ['contato', 'Contato']]

// Coluna fixa à esquerda (telas largas): nome, profissão, frase e menu.
function Sidebar({ s }) {
  const [active, setActive] = useState('portfolio')
  useEffect(() => {
    const els = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  const socials = socialList.filter((x) => s[x.key])
  return (
    <aside className="sidebar">
      <a href="#portfolio" className="sidebar-name">{s.name}</a>
      {s.role && <p className="eyebrow">{s.role}</p>}
      {s.tagline && <h1 className="sidebar-tagline">{s.tagline}</h1>}
      <nav className="sidebar-nav" aria-label="Menu principal">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
        ))}
      </nav>
      <div className="sidebar-foot">
        {socials.length > 0 && (
          <div className="sidebar-socials">
            {socials.map(({ key, label, icon: I }) => (
              <a key={key} href={s[key]} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><I width="18" height="18" /></a>
            ))}
          </div>
        )}
        <span>© {new Date().getFullYear()} {s.name}</span>
      </div>
    </aside>
  )
}

export default function PublicSite() {
  const { data, error } = useSiteData({ refetchOnFocus: true })

  useEffect(() => {
    document.documentElement.classList.add('site-dark')
    return () => document.documentElement.classList.remove('site-dark')
  }, [])

  useEffect(() => {
    if (!data) return
    const { name, role, tagline } = data.settings
    if (name) document.title = `${name}${role ? ` — ${role}` : ''}`
    if (tagline) document.querySelector('meta[name="description"]')?.setAttribute('content', tagline)
  }, [data])

  if (error) return <div className="state">Não foi possível carregar o portfólio. Tente novamente em instantes.</div>
  if (!data) return <div className="state"><span className="spinner" aria-label="Carregando" /></div>

  const s = data.settings
  return (
    <div className="layout">
      <Sidebar s={s} />
      <div className="layout-content">
        {/* No celular, o topo continua horizontal */}
        <div className="mobile-only">
          <Header settings={s} />
          <div className="wrap intro">
            {s.role && <p className="eyebrow">{s.role}</p>}
            {s.tagline && <p className="tagline">{s.tagline}</p>}
          </div>
        </div>
        <main>
          <div className="wrap gallery-wrap">
            <Gallery photos={data.photos} categories={data.categories} />
          </div>
          <About s={s} />
          <Contact s={s} />
        </main>
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <span>© {new Date().getFullYear()} {s.name}</span>
            <a href="#portfolio">Voltar ao topo ↑</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

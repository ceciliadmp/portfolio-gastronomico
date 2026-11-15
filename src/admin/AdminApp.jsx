import { useEffect, useState } from 'react'
import { auth, api, isDemo } from '../lib/api'
import { useSiteData } from '../lib/useSiteData'
import { Icon } from '../lib/icons'
import { ToastProvider, useToast } from './Toast'
import Login from './Login'
import PhotosPanel from './PhotosPanel'
import CategoriesPanel from './CategoriesPanel'
import { AboutPanel, HeaderPanel, ContactPanel } from './SettingsPanels'

const TABS = [
  { id: 'fotos', label: 'Fotos', icon: Icon.photo, C: PhotosPanel },
  { id: 'categorias', label: 'Categorias', icon: Icon.tag, C: CategoriesPanel },
  { id: 'sobre', label: 'Sobre mim', icon: Icon.user, C: AboutPanel },
  { id: 'cabecalho', label: 'Cabeçalho', icon: Icon.type, C: HeaderPanel },
  { id: 'contato', label: 'Contato', icon: Icon.phone, C: ContactPanel },
]

function Dashboard({ session }) {
  const { data, setData, error, reload } = useSiteData()
  const [tab, setTab] = useState(() => (location.hash.slice(1) || 'fotos'))
  const toast = useToast()
  useEffect(() => { history.replaceState(null, '', `#${tab}`); window.scrollTo(0, 0) }, [tab])
  useEffect(() => { document.title = 'Painel — Portfólio' }, [])
  const current = TABS.find((t) => t.id === tab) || TABS[0]

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-brand">
          <strong>{data?.settings?.name || 'Portfólio'}</strong>
          <span className="muted small">Painel de edição</span>
        </div>
        <nav className="admin-nav">
          {TABS.map(({ id, label, icon: I }) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
              <I width="18" height="18" /> <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-side-foot">
          <span className="muted small ellipsis">{session.user?.email}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => auth.signOut()}><Icon.logout width="16" /> Sair</button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-top">
          {isDemo ? (
            <span className="demo-badge" title="Sem Supabase configurado: as mudanças ficam salvas só neste navegador.">
              Modo demonstração
            </span>
          ) : <span />}
          <div className="admin-top-actions">
            {isDemo && (
              <button className="btn btn-ghost btn-sm" onClick={async () => {
                if (!confirm('Restaurar o conteúdo de exemplo? Suas alterações de demonstração serão perdidas.')) return
                await api.resetDemo(); await reload(); toast('Conteúdo de exemplo restaurado.')
              }}>Restaurar exemplo</button>
            )}
            <a className="btn btn-sm" href="/" target="_blank" rel="noopener">Ver site <Icon.external width="15" /></a>
            <button className="btn btn-ghost btn-sm only-mobile" onClick={() => auth.signOut()} aria-label="Sair"><Icon.logout width="16" /></button>
          </div>
        </div>
        {error && <p className="form-error">Erro ao carregar dados: {error.message}</p>}
        {!data ? <div className="state"><span className="spinner" /></div> : <current.C key={current.id} data={data} setData={setData} />}
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    auth.getSession().then(setSession)
    return auth.onChange(setSession)
  }, [])
  if (session === undefined) return <div className="state"><span className="spinner" /></div>
  return <ToastProvider>{session ? <Dashboard session={session} /> : <Login />}</ToastProvider>
}

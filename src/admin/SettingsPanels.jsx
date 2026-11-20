import { useRef, useState } from 'react'
import { api } from '../lib/api'
import { Icon, socialList } from '../lib/icons'
import { useToast, errMsg } from './Toast'
import RichText from './RichText'

function useSettingsForm(data, setData, keys) {
  const pick = () => Object.fromEntries(keys.map((k) => [k, data.settings[k] ?? '']))
  const [f, setF] = useState(pick)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const dirty = keys.some((k) => (f[k] ?? '') !== (data.settings[k] ?? ''))
  const bind = (k) => ({ value: f[k], onChange: (e) => setF((x) => ({ ...x, [k]: e.target.value })) })
  const save = async (e) => {
    e?.preventDefault()
    setBusy(true)
    try {
      const s = await api.updateSettings(f)
      setData((d) => ({ ...d, settings: { ...d.settings, ...s } }))
      toast('Alterações salvas! Já estão no site.')
    } catch (err) { toast(errMsg(err), 'error') }
    setBusy(false)
  }
  return { f, setF, bind, save, busy, dirty }
}

const SaveBar = ({ busy, dirty }) => (
  <div className="savebar">
    <span className="muted small">{dirty ? 'Há alterações não salvas.' : 'Tudo salvo.'}</span>
    <button className="btn btn-primary" disabled={busy || !dirty}>{busy ? 'Salvando…' : 'Salvar alterações'}</button>
  </div>
)

export function HeaderPanel({ data, setData }) {
  const { bind, save, busy, dirty } = useSettingsForm(data, setData, ['name', 'role', 'tagline'])
  return (
    <form className="panel" onSubmit={save}>
      <div className="panel-head">
        <h1>Cabeçalho</h1>
        <p className="muted">O que aparece no topo do site, logo acima da galeria.</p>
      </div>
      <div className="card form">
        <label>Seu nome<input {...bind('name')} /></label>
        <label>Profissão <span className="muted small">(aparece pequena, acima da frase)</span><input {...bind('role')} placeholder="Chef de cozinha" /></label>
        <label>Frase de apresentação<textarea rows={3} maxLength={180} {...bind('tagline')} />
          <span className="muted small">Curta e direta — até 180 caracteres.</span>
        </label>
      </div>
      <p className="note">
        <b>Pré-visualização do link (WhatsApp, Instagram, Google):</b> nome, profissão e frase entram nela na
        próxima publicação do site. Depois de alterar, abra a Vercel → <i>Deployments</i> → ⋯ → <i>Redeploy</i>.
      </p>
      <SaveBar busy={busy} dirty={dirty} />
    </form>
  )
}

export function ContactPanel({ data, setData }) {
  const keys = ['email', 'whatsapp', ...socialList.map((s) => s.key)]
  const { bind, save, busy, dirty } = useSettingsForm(data, setData, keys)
  return (
    <form className="panel" onSubmit={save}>
      <div className="panel-head">
        <h1>Contato</h1>
        <p className="muted">Deixe em branco o que não quiser mostrar no site.</p>
      </div>
      <div className="card form">
        <label><span className="lbl"><Icon.mail width="16" /> E-mail</span><input type="email" {...bind('email')} /></label>
        <label><span className="lbl"><Icon.whatsapp width="16" /> WhatsApp</span>
          <input type="tel" placeholder="55 11 99999-9999" {...bind('whatsapp')} />
          <span className="muted small">Com código do país e DDD (ex.: 55 11 99999-9999).</span>
        </label>
        {socialList.map(({ key, label, icon: I }) => (
          <label key={key}><span className="lbl"><I width="16" /> {label}</span>
            <input type="url" placeholder="https://" {...bind(key)} />
          </label>
        ))}
      </div>
      <SaveBar busy={busy} dirty={dirty} />
    </form>
  )
}

export function AboutPanel({ data, setData }) {
  const { f, setF, bind, save, busy, dirty } = useSettingsForm(data, setData, [
    'about_title', 'about_html', 'education', 'experience', 'specialties',
  ])
  const toast = useToast()
  const input = useRef(null)
  const [uploading, setUploading] = useState(false)

  const changePhoto = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const patch = await api.uploadAboutPhoto(file, data.settings.about_photo_path)
      const s = await api.updateSettings(patch)
      setData((d) => ({ ...d, settings: { ...d.settings, ...s } }))
      toast('Foto de perfil atualizada!')
    } catch (err) { toast(errMsg(err), 'error') }
    setUploading(false)
  }

  return (
    <form className="panel" onSubmit={save}>
      <div className="panel-head">
        <h1>Sobre mim</h1>
        <p className="muted">Sua foto, sua história e sua trajetória.</p>
      </div>
      <div className="card about-photo-edit">
        <div className="avatar">{data.settings.about_photo_url ? <img src={data.settings.about_photo_url} alt="" /> : <Icon.user />}</div>
        <div>
          <strong>Foto de perfil</strong>
          <p className="muted small">Vertical fica mais bonita (proporção 4:5).</p>
          <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { changePhoto(e.target.files[0]); e.target.value = '' }} />
          <button type="button" className="btn" onClick={() => input.current.click()} disabled={uploading}>
            {uploading ? 'Enviando…' : 'Trocar foto'}
          </button>
        </div>
      </div>
      <div className="card form">
        <label>Título da seção<input {...bind('about_title')} placeholder="Uma frase que resuma você" /></label>
        <div className="label">Minha história
          <RichText value={f.about_html} onChange={(html) => setF((x) => ({ ...x, about_html: html }))} />
        </div>
        <label>Formação <span className="muted small">(um item por linha)</span><textarea rows={4} {...bind('education')} /></label>
        <label>Experiências <span className="muted small">(um item por linha)</span><textarea rows={5} {...bind('experience')} /></label>
        <label>Especialidades <span className="muted small">(uma por linha)</span><textarea rows={4} {...bind('specialties')} /></label>
      </div>
      <SaveBar busy={busy} dirty={dirty} />
    </form>
  )
}

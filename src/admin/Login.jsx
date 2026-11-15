import { useState } from 'react'
import { auth, isDemo, DEMO_LOGIN } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState(isDemo ? DEMO_LOGIN.email : '')
  const [password, setPassword] = useState(isDemo ? DEMO_LOGIN.password : '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try { await auth.signIn(email, password) } catch (err) { setError(err.message) }
    setBusy(false)
  }

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <h1>Painel</h1>
        <p className="muted">Entre para editar o seu portfólio.</p>
        {isDemo && (
          <p className="note">Modo demonstração: use <b>{DEMO_LOGIN.email}</b> / <b>{DEMO_LOGIN.password}</b>.</p>
        )}
        <label>E-mail
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Senha
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <a href="/" className="muted small">← Voltar ao site</a>
      </form>
    </div>
  )
}

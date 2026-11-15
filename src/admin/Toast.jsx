import { createContext, useCallback, useContext, useState } from 'react'

const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const show = useCallback((text, type = 'ok') => {
    const id = Math.random()
    setItems((l) => [...l, { id, text, type }])
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), type === 'error' ? 6000 : 3000)
  }, [])
  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.type === 'error' ? '!' : '✓'}</span>{t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const errMsg = (e) => e?.message || 'Algo deu errado. Tente novamente.'

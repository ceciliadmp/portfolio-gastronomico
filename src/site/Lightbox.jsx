import { useEffect, useRef, useState } from 'react'
import { Icon } from '../lib/icons'

export default function Lightbox({ photos, index, categories, onIndex, onClose }) {
  const photo = photos[index]
  const total = photos.length
  const go = (d) => onIndex((index + d + total) % total)
  const touch = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => setLoaded(false), [index])

  useEffect(() => {
    const prev = document.activeElement
    closeRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; prev?.focus?.() }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    // pré-carrega vizinhas
    ;[1, -1].forEach((d) => { const n = photos[(index + d + total) % total]; if (n) new Image().src = n.url })
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!photo) return null
  const cat = categories.find((c) => c.id === photo.category_id)

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || 'Foto'}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      <div className="lb-top">
        <span className="lb-count">{index + 1} / {total}</span>
        <button ref={closeRef} className="lb-btn" onClick={onClose} aria-label="Fechar"><Icon.close /></button>
      </div>

      <figure className="lb-figure" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img
          key={photo.id}
          className={loaded ? 'loaded' : ''}
          src={photo.url}
          alt={photo.title || ''}
          onLoad={() => setLoaded(true)}
          style={{ backgroundImage: `url(${photo.thumb_url || ''})` }}
        />
      </figure>

      {total > 1 && (
        <>
          <button className="lb-btn lb-nav lb-prev" onClick={() => go(-1)} aria-label="Foto anterior"><Icon.left /></button>
          <button className="lb-btn lb-nav lb-next" onClick={() => go(1)} aria-label="Próxima foto"><Icon.right /></button>
        </>
      )}

      <figcaption className="lb-caption">
        {cat && <span className="lb-cat">{cat.name}</span>}
        {photo.title && <h2>{photo.title}</h2>}
        {photo.description && <p>{photo.description}</p>}
      </figcaption>
    </div>
  )
}

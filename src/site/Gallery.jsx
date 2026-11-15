import { useEffect, useMemo, useState } from 'react'
import { reveal } from './reveal'
import Lightbox from './Lightbox'

function useColumns() {
  const calc = () => {
    const w = window.innerWidth
    return w < 700 ? 2 : w < 1500 ? 3 : 4
  }
  const [n, setN] = useState(calc)
  useEffect(() => {
    const f = () => setN(calc())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return n
}

function Tile({ photo, onOpen, eager }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const ratio = photo.width && photo.height ? `${photo.width} / ${photo.height}` : '4 / 5'
  return (
    <button className="tile reveal" ref={reveal} onClick={onOpen} aria-label={`Abrir foto: ${photo.title || 'sem título'}`}>
      <div className={`tile-media${loaded ? ' loaded' : ''}${failed ? ' failed' : ''}`} style={{ aspectRatio: ratio }}>
        {!failed && (
          <img
            src={photo.thumb_url || photo.url}
            alt={photo.title || ''}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {photo.title && <span className="tile-caption">{photo.title}</span>}
    </button>
  )
}

export default function Gallery({ photos, categories }) {
  const [filter, setFilter] = useState('all')
  const [openIndex, setOpenIndex] = useState(null)
  const cols = useColumns()

  const usedCats = useMemo(
    () => categories.filter((c) => photos.some((p) => p.category_id === c.id)),
    [categories, photos]
  )
  const visible = useMemo(
    () => (filter === 'all' ? photos : photos.filter((p) => p.category_id === filter)),
    [photos, filter]
  )

  // Distribui as fotos nas colunas pela menor altura, mantendo a ordem de leitura.
  const columns = useMemo(() => {
    const out = Array.from({ length: cols }, () => ({ h: 0, items: [] }))
    visible.forEach((p, i) => {
      const col = out.reduce((a, b) => (b.h < a.h - 0.01 ? b : a))
      col.items.push({ p, i })
      col.h += p.width && p.height ? p.height / p.width : 1.25
    })
    return out
  }, [visible, cols])

  return (
    <section id="portfolio" className="gallery">
      {usedCats.length > 1 && (
        <nav className="filters" aria-label="Filtrar por categoria">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tudo</button>
          {usedCats.map((c) => (
            <button key={c.id} className={filter === c.id ? 'active' : ''} onClick={() => setFilter(c.id)}>
              {c.name}
            </button>
          ))}
        </nav>
      )}

      {visible.length === 0 ? (
        <p className="empty">Nenhuma foto por aqui ainda.</p>
      ) : (
        <div className="masonry" key={filter}>
          {columns.map((col, ci) => (
            <div className="masonry-col" key={ci}>
              {col.items.map(({ p, i }) => (
                <Tile key={p.id} photo={p} eager={i < cols * 2} onOpen={() => setOpenIndex(i)} />
              ))}
            </div>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <Lightbox
          photos={visible}
          index={openIndex}
          categories={categories}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  )
}

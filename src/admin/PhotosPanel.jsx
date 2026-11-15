import { useRef, useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, rectSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { api } from '../lib/api'
import { Icon } from '../lib/icons'
import { useToast, errMsg } from './Toast'

function Card({ photo, catName, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id })
  return (
    <div
      ref={setNodeRef}
      className={`pcard${isDragging ? ' dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button className="pcard-img" onClick={onEdit} aria-label={`Editar ${photo.title}`}>
        <img src={photo.thumb_url || photo.url} alt="" loading="lazy" />
      </button>
      <div className="pcard-meta">
        <button className="pcard-text" onClick={onEdit}>
          <strong>{photo.title || 'Sem título'}</strong>
          <span>{catName || 'Sem categoria'}</span>
        </button>
        <button className="handle" {...attributes} {...listeners} aria-label="Arrastar para reordenar" title="Arrastar para reordenar">
          <Icon.grip />
        </button>
      </div>
    </div>
  )
}

function EditModal({ photo, categories, onClose, onSaved, onDeleted }) {
  const [f, setF] = useState({ title: photo.title || '', description: photo.description || '', category_id: photo.category_id || '' })
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const row = await api.updatePhoto(photo.id, { ...f, category_id: f.category_id || null })
      onSaved({ ...photo, ...row })
      toast('Foto atualizada.')
      onClose()
    } catch (err) { toast(errMsg(err), 'error') }
    setBusy(false)
  }
  const del = async () => {
    if (!confirm('Excluir esta foto definitivamente?')) return
    setBusy(true)
    try {
      await api.deletePhoto(photo)
      onDeleted(photo.id)
      toast('Foto excluída.')
      onClose()
    } catch (err) { toast(errMsg(err), 'error'); setBusy(false) }
  }

  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={save}>
        <div className="modal-img"><img src={photo.thumb_url || photo.url} alt="" /></div>
        <div className="modal-body">
          <h2>Editar foto</h2>
          <label>Título
            <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          </label>
          <label>Descrição curta
            <textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </label>
          <label>Categoria
            <select value={f.category_id} onChange={(e) => setF({ ...f, category_id: e.target.value })}>
              <option value="">Sem categoria</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-danger-ghost" onClick={del} disabled={busy}><Icon.trash /> Excluir</button>
            <span className="spacer" />
            <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function PhotosPanel({ data, setData }) {
  const { photos, categories } = data
  const toast = useToast()
  const input = useRef(null)
  const [over, setOver] = useState(false)
  const [progress, setProgress] = useState(null)
  const [uploadCat, setUploadCat] = useState('')
  const [editing, setEditing] = useState(null)

  const setPhotos = (fn) => setData((d) => ({ ...d, photos: fn(d.photos) }))
  const catName = (id) => categories.find((c) => c.id === id)?.name

  const upload = async (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'))
    if (!files.length) return toast('Selecione arquivos de imagem (JPG, PNG, WEBP, HEIC).', 'error')
    let ok = 0
    for (let i = 0; i < files.length; i++) {
      setProgress({ i: i + 1, n: files.length, name: files[i].name })
      try {
        const row = await api.addPhoto(files[i], { category_id: uploadCat || null })
        setPhotos((l) => [row, ...l])
        ok++
      } catch (err) {
        console.error(err)
        toast(`Falha ao enviar ${files[i].name}: ${errMsg(err)}`, 'error')
      }
    }
    setProgress(null)
    if (ok) toast(ok === 1 ? 'Foto enviada! Ela já aparece no topo da galeria.' : `${ok} fotos enviadas!`)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return
    const from = photos.findIndex((p) => p.id === active.id)
    const to = photos.findIndex((p) => p.id === over.id)
    const next = arrayMove(photos, from, to).map((p, i) => ({ ...p, position: i }))
    setPhotos(() => next)
    try {
      await api.reorderPhotos(next.map((p) => p.id))
      toast('Nova ordem salva.')
    } catch (err) { toast(errMsg(err), 'error') }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h1>Fotos</h1>
        <p className="muted">{photos.length} fotos na galeria. Arraste pelo ícone <Icon.grip width="14" height="14" style={{ verticalAlign: '-2px' }} /> para mudar a ordem; toque numa foto para editar.</p>
      </div>

      <div
        className={`dropzone${over ? ' over' : ''}${progress ? ' busy' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (!progress) upload(e.dataTransfer.files) }}
        onClick={() => !progress && input.current.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current.click()}
      >
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { upload(e.target.files); e.target.value = '' }} />
        <Icon.upload width="28" height="28" />
        {progress ? (
          <>
            <strong>Enviando {progress.i} de {progress.n}…</strong>
            <span className="muted small">Otimizando e enviando “{progress.name}”</span>
            <div className="bar"><div style={{ width: `${((progress.i - 0.5) / progress.n) * 100}%` }} /></div>
          </>
        ) : (
          <>
            <strong>Arraste suas fotos aqui</strong>
            <span className="muted small">ou clique para escolher. As imagens são redimensionadas e comprimidas automaticamente.</span>
          </>
        )}
      </div>
      <label className="inline-field">Categoria das novas fotos:
        <select value={uploadCat} onChange={(e) => setUploadCat(e.target.value)}>
          <option value="">Sem categoria</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="pgrid">
            {photos.map((p) => (
              <Card key={p.id} photo={p} catName={catName(p.category_id)} onEdit={() => setEditing(p)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing && (
        <EditModal
          photo={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={(row) => setPhotos((l) => l.map((p) => (p.id === row.id ? row : p)))}
          onDeleted={(id) => setPhotos((l) => l.filter((p) => p.id !== id))}
        />
      )}
    </div>
  )
}

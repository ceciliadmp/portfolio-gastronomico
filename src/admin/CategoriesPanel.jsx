import { useState } from 'react'
import { api } from '../lib/api'
import { Icon } from '../lib/icons'
import { useToast, errMsg } from './Toast'

function Row({ cat, count, first, last, onRename, onDelete, onMove }) {
  const [name, setName] = useState(cat.name)
  const dirty = name.trim() && name.trim() !== cat.name
  return (
    <li className="cat-row">
      <div className="cat-move">
        <button className="icon-btn" disabled={first} onClick={() => onMove(-1)} aria-label="Subir"><Icon.up /></button>
        <button className="icon-btn" disabled={last} onClick={() => onMove(1)} aria-label="Descer"><Icon.down /></button>
      </div>
      <form className="cat-name" onSubmit={(e) => { e.preventDefault(); dirty && onRename(name.trim()) }}>
        <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Nome da categoria" />
        {dirty && <button className="btn btn-primary btn-sm">Salvar</button>}
      </form>
      <span className="muted small cat-count">{count} {count === 1 ? 'foto' : 'fotos'}</span>
      <button className="icon-btn danger" onClick={onDelete} aria-label={`Excluir ${cat.name}`}><Icon.trash /></button>
    </li>
  )
}

export default function CategoriesPanel({ data, setData }) {
  const { categories, photos } = data
  const toast = useToast()
  const [name, setName] = useState('')
  const setCats = (fn) => setData((d) => ({ ...d, categories: fn(d.categories) }))

  const add = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const row = await api.addCategory(name.trim())
      setCats((l) => [...l, row])
      setName('')
      toast('Categoria criada.')
    } catch (err) { toast(errMsg(err), 'error') }
  }
  const rename = async (cat, n) => {
    try {
      await api.renameCategory(cat.id, n)
      setCats((l) => l.map((c) => (c.id === cat.id ? { ...c, name: n } : c)))
      toast('Categoria renomeada.')
    } catch (err) { toast(errMsg(err), 'error') }
  }
  const del = async (cat, count) => {
    const msg = count
      ? `Excluir “${cat.name}”? As ${count} fotos dessa categoria continuarão na galeria, mas ficarão sem categoria.`
      : `Excluir “${cat.name}”?`
    if (!confirm(msg)) return
    try {
      await api.deleteCategory(cat.id)
      setData((d) => ({
        ...d,
        categories: d.categories.filter((c) => c.id !== cat.id),
        photos: d.photos.map((p) => (p.category_id === cat.id ? { ...p, category_id: null } : p)),
      }))
      toast('Categoria excluída.')
    } catch (err) { toast(errMsg(err), 'error') }
  }
  const move = async (i, d) => {
    const next = [...categories]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    setCats(() => next.map((c, k) => ({ ...c, position: k })))
    try { await api.reorderCategories(next.map((c) => c.id)); toast('Ordem dos filtros salva.') }
    catch (err) { toast(errMsg(err), 'error') }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h1>Categorias</h1>
        <p className="muted">As categorias aparecem como filtros acima da galeria, nesta ordem. Só aparecem no site as que têm fotos.</p>
      </div>
      <form className="add-row" onSubmit={add}>
        <input placeholder="Nova categoria (ex.: Entradas)" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn btn-primary" disabled={!name.trim()}>Adicionar</button>
      </form>
      <ul className="cat-list">
        {categories.map((c, i) => {
          const count = photos.filter((p) => p.category_id === c.id).length
          return (
            <Row
              key={c.id + c.name}
              cat={c}
              count={count}
              first={i === 0}
              last={i === categories.length - 1}
              onRename={(n) => rename(c, n)}
              onDelete={() => del(c, count)}
              onMove={(d) => move(i, d)}
            />
          )
        })}
        {!categories.length && <li className="muted">Nenhuma categoria ainda.</li>}
      </ul>
    </div>
  )
}

// Camada de dados. Usa o Supabase quando configurado (.env);
// caso contrário roda em "modo demonstração", salvando no próprio navegador.
import { createClient } from '@supabase/supabase-js'
import { get as idbGet, set as idbSet } from 'idb-keyval'
import { processImage, blobToDataURL } from './image'
import { seedCategories, seedPhotos, seedSettings } from './seed'

const URL_ = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isDemo = !URL_ || !KEY
export const supabase = isDemo ? null : createClient(URL_, KEY)
const BUCKET = 'photos'

const byPos = (a, b) => a.position - b.position
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

/* ---------------------------------------------------------------- DEMO -- */
export const DEMO_LOGIN = { email: 'admin@demo.com', password: 'demo123' }
const DB_KEY = 'portfolio-demo-v1'
const SESSION_KEY = 'portfolio-demo-session'
const authListeners = new Set()

async function demoLoad() {
  let db = await idbGet(DB_KEY).catch(() => null)
  if (!db) {
    db = { settings: seedSettings, categories: seedCategories, photos: seedPhotos }
    await idbSet(DB_KEY, db).catch(() => {})
  }
  return db
}
async function demoSave(mut) {
  const db = await demoLoad()
  mut(db)
  await idbSet(DB_KEY, db)
  return db
}
const demoSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}

/* ------------------------------------------------------------ HELPERS -- */
async function uploadBlob(blob, folder) {
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${folder}/${uid()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type, cacheControl: '31536000', upsert: false,
  })
  if (error) throw error
  return { path, url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl }
}
async function removeFiles(paths) {
  const list = paths.filter(Boolean)
  if (list.length) await supabase.storage.from(BUCKET).remove(list)
}
function check({ data, error }) {
  if (error) throw error
  return data
}

/* ---------------------------------------------------------------- API -- */
export const api = {
  async getSiteData() {
    if (isDemo) {
      const db = await demoLoad()
      return {
        settings: db.settings,
        categories: [...db.categories].sort(byPos),
        photos: [...db.photos].sort(byPos),
      }
    }
    const [s, c, p] = await Promise.all([
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('categories').select('*').order('position'),
      supabase.from('photos').select('*').order('position'),
    ])
    return { settings: check(s) || {}, categories: check(c) || [], photos: check(p) || [] }
  },

  /* Configurações (cabeçalho, sobre, contato) */
  async updateSettings(patch) {
    if (isDemo) return (await demoSave((db) => Object.assign(db.settings, patch))).settings
    return check(await supabase.from('settings').update(patch).eq('id', 1).select().single())
  },

  async uploadAboutPhoto(file, oldPath) {
    const img = await processImage(file, { maxSide: 1400, thumbSide: 200 })
    if (isDemo) return { about_photo_url: await blobToDataURL(img.full), about_photo_path: null }
    const up = await uploadBlob(img.full, 'perfil')
    if (oldPath) await removeFiles([oldPath])
    return { about_photo_url: up.url, about_photo_path: up.path }
  },

  async removeAboutPhoto(path) {
    if (!isDemo && path) await removeFiles([path])
  },

  /* Fotos */
  async addPhoto(file, meta = {}) {
    const img = await processImage(file)
    const base = {
      title: meta.title ?? file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      description: meta.description ?? '',
      category_id: meta.category_id ?? null,
      width: img.width,
      height: img.height,
    }
    if (isDemo) {
      const [url, thumb_url] = await Promise.all([blobToDataURL(img.full), blobToDataURL(img.thumb)])
      let row
      await demoSave((db) => {
        db.photos.forEach((p) => (p.position += 1))
        row = { id: uid(), ...base, url, thumb_url, path: null, thumb_path: null, position: 0, created_at: new Date().toISOString() }
        db.photos.push(row)
      })
      return row
    }
    const [full, thumb] = await Promise.all([uploadBlob(img.full, 'galeria'), uploadBlob(img.thumb, 'galeria/thumbs')])
    const { data: min } = await supabase.from('photos').select('position').order('position').limit(1)
    const position = min?.length ? min[0].position - 1 : 0
    return check(
      await supabase.from('photos').insert({
        ...base, url: full.url, path: full.path, thumb_url: thumb.url, thumb_path: thumb.path, position,
      }).select().single()
    )
  },

  async updatePhoto(id, patch) {
    if (isDemo) {
      let row
      await demoSave((db) => { row = db.photos.find((p) => p.id === id); Object.assign(row, patch) })
      return row
    }
    return check(await supabase.from('photos').update(patch).eq('id', id).select().single())
  },

  async deletePhoto(photo) {
    if (isDemo) return void (await demoSave((db) => { db.photos = db.photos.filter((p) => p.id !== photo.id) }))
    check(await supabase.from('photos').delete().eq('id', photo.id))
    await removeFiles([photo.path, photo.thumb_path])
  },

  async reorderPhotos(ids) {
    if (isDemo) return void (await demoSave((db) => db.photos.forEach((p) => (p.position = ids.indexOf(p.id)))))
    check(await supabase.rpc('reorder_photos', { ids }))
  },

  /* Categorias */
  async addCategory(name) {
    if (isDemo) {
      let row
      await demoSave((db) => {
        row = { id: uid(), name, position: db.categories.length }
        db.categories.push(row)
      })
      return row
    }
    const { data: max } = await supabase.from('categories').select('position').order('position', { ascending: false }).limit(1)
    return check(await supabase.from('categories').insert({ name, position: max?.length ? max[0].position + 1 : 0 }).select().single())
  },

  async renameCategory(id, name) {
    if (isDemo) return void (await demoSave((db) => (db.categories.find((c) => c.id === id).name = name)))
    check(await supabase.from('categories').update({ name }).eq('id', id))
  },

  async deleteCategory(id) {
    if (isDemo) {
      return void (await demoSave((db) => {
        db.categories = db.categories.filter((c) => c.id !== id)
        db.photos.forEach((p) => { if (p.category_id === id) p.category_id = null })
      }))
    }
    check(await supabase.from('categories').delete().eq('id', id))
  },

  async reorderCategories(ids) {
    if (isDemo) return void (await demoSave((db) => db.categories.forEach((c) => (c.position = ids.indexOf(c.id)))))
    check(await supabase.rpc('reorder_categories', { ids }))
  },

  async resetDemo() {
    await idbSet(DB_KEY, { settings: seedSettings, categories: seedCategories, photos: seedPhotos })
  },
}

/* --------------------------------------------------------------- AUTH -- */
export const auth = {
  async getSession() {
    if (isDemo) return demoSession()
    return (await supabase.auth.getSession()).data.session
  },
  async signIn(email, password) {
    if (isDemo) {
      if (email.trim().toLowerCase() !== DEMO_LOGIN.email || password !== DEMO_LOGIN.password)
        throw new Error('E-mail ou senha incorretos.')
      const s = { user: { email: DEMO_LOGIN.email } }
      localStorage.setItem(SESSION_KEY, JSON.stringify(s))
      authListeners.forEach((f) => f(s))
      return s
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message)
    return data.session
  },
  async signOut() {
    if (isDemo) {
      localStorage.removeItem(SESSION_KEY)
      authListeners.forEach((f) => f(null))
      return
    }
    await supabase.auth.signOut()
  },
  onChange(cb) {
    if (isDemo) {
      authListeners.add(cb)
      return () => authListeners.delete(cb)
    }
    const { data } = supabase.auth.onAuthStateChange((_e, s) => cb(s))
    return () => data.subscription.unsubscribe()
  },
}

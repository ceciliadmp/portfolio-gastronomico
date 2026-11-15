// Comprime e redimensiona imagens no navegador antes do envio.
async function loadBitmap(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await img.decode()
    URL.revokeObjectURL(url)
    return img
  }
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

async function resize(source, maxSide, quality) {
  const w0 = source.width, h0 = source.height
  const scale = Math.min(1, maxSide / Math.max(w0, h0))
  const w = Math.round(w0 * scale), h = Math.round(h0 * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, w, h)
  let blob = await toBlob(canvas, 'image/webp', quality)
  if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', quality)
  return { blob, width: w, height: h }
}

/** Retorna { full, thumb, width, height } — full ≤ 2000px, thumb ≤ 800px. */
export async function processImage(file, { maxSide = 2000, thumbSide = 800 } = {}) {
  if (!file.type.startsWith('image/')) throw new Error('O arquivo não é uma imagem.')
  const bmp = await loadBitmap(file)
  const full = await resize(bmp, maxSide, 0.82)
  const thumb = await resize(bmp, thumbSide, 0.75)
  if (bmp.close) bmp.close()
  return { full: full.blob, thumb: thumb.blob, width: full.width, height: full.height }
}

export function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(blob)
  })
}

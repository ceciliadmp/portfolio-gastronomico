import { useEffect, useRef } from 'react'
import { cleanHtml } from '../lib/sanitize'

// Editor simples: negrito, itálico e parágrafos.
export default function RichText({ value, onChange }) {
  const ref = useRef(null)
  const last = useRef(null)

  useEffect(() => {
    if (ref.current && value !== last.current) {
      ref.current.innerHTML = cleanHtml(value)
      last.current = value
    }
  }, [value])

  const emit = () => {
    const html = cleanHtml(ref.current.innerHTML)
    last.current = html
    onChange(html)
  }
  const cmd = (c) => {
    ref.current.focus()
    document.execCommand(c)
    emit()
  }

  return (
    <div className="rte">
      <div className="rte-bar">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); cmd('bold') }} title="Negrito (Ctrl+B)"><b>N</b></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); cmd('italic') }} title="Itálico (Ctrl+I)"><i>I</i></button>
        <span className="rte-hint">Enter cria um novo parágrafo</span>
      </div>
      <div
        ref={ref}
        className="rte-area prose"
        contentEditable
        suppressContentEditableWarning
        onFocus={() => document.execCommand('defaultParagraphSeparator', false, 'p')}
        onInput={emit}
        onPaste={(e) => {
          e.preventDefault()
          document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
        }}
      />
    </div>
  )
}

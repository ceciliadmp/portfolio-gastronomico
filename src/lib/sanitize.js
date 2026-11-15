import DOMPurify from 'dompurify'
export const cleanHtml = (html) =>
  DOMPurify.sanitize(html || '', { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'div'], ALLOWED_ATTR: [] })

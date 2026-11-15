// Animação suave de entrada ao rolar a página.
let io
export function reveal(el) {
  if (!el) return
  if (typeof IntersectionObserver === 'undefined') return el.classList.add('in')
  io ||= new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }),
    { rootMargin: '0px 0px -6% 0px', threshold: 0.01 }
  )
  io.observe(el)
}

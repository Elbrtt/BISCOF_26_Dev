/**
 * v-reveal — fades an element in the first time it reaches the viewport.
 * v-reveal="150" delays the transition by 150 ms so a row of items can stagger.
 *
 * IntersectionObserver alone is not enough here: a jump scroll, an anchor, or a
 * kiosk flicking through pages can skip past an element without the observer
 * ever sampling it, which would leave that block invisible for good. So every
 * pending element is also swept on scroll and resize, and anything at or above
 * the fold is shown.
 */

const pending = new Set()
let queued = false

const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => entry.isIntersecting && show(entry.target))
        },
        { threshold: 0, rootMargin: '0px 0px -8% 0px' }
      )
    : null

function show(el) {
  el.classList.add('is-in')
  pending.delete(el)
  observer?.unobserve(el)
}

function reached(el) {
  const r = el.getBoundingClientRect()
  const h = window.innerHeight || document.documentElement.clientHeight
  return r.top < h * 0.92 // true for anything already scrolled past, too
}

function sweep() {
  queued = false
  pending.forEach((el) => {
    if (!el.isConnected) return pending.delete(el)
    if (reached(el)) show(el)
  })
}

function schedule() {
  if (queued) return
  queued = true
  requestAnimationFrame(sweep)
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

export default {
  mounted(el, binding) {
    el.classList.add('reveal')
    const delay = Number(binding.value) || 0
    if (delay) el.style.transitionDelay = `${delay}ms`

    if (!observer) {
      el.classList.add('is-in')
      return
    }

    pending.add(el)
    observer.observe(el)
    // first paint after a route change: show whatever is already on screen
    requestAnimationFrame(() => {
      if (pending.has(el) && reached(el)) show(el)
    })
  },
  unmounted(el) {
    pending.delete(el)
    observer?.unobserve(el)
  }
}

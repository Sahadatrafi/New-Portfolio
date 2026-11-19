import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

const root = () => document.documentElement
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function applyTheme(dark) {
  root().classList.toggle('dark', dark)
  try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch (e) {}
}

// The new theme spreads out in a circle from the button, like a ripple of light (or dark).
// Browsers without the View Transitions API get a soft colour cross-fade instead.
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => root().classList.contains('dark'))
  const btn = useRef(null)
  useEffect(() => { applyTheme(dark) }, [dark])

  const toggle = async () => {
    const next = !dark
    if (reduced()) { applyTheme(next); setDark(next); return }
    if (!document.startViewTransition) {
      root().classList.add('theme-anim')
      applyTheme(next); setDark(next)
      setTimeout(() => root().classList.remove('theme-anim'), 700)
      return
    }
    const r = btn.current.getBoundingClientRect()
    const x = r.left + r.width / 2, y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const t = document.startViewTransition(() => { applyTheme(next); setDark(next) })
    try {
      await t.ready
      root().animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 800, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    } catch (e) {}
  }

  return (
    <button ref={btn} onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full lg:h-9 lg:w-9 text-muted transition hover:bg-line/10 hover:text-ink">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? 'sun' : 'moon'} initial={{ rotate: -90, scale: 0.4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0.4, opacity: 0 }} transition={{ duration: 0.25 }} className="grid place-items-center">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

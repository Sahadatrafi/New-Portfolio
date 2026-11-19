import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

// Floating button: appears after scrolling, and its ring fills up to show how far down the page you are.
export default function BackToTop() {
  const [y, setY] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setY(window.scrollY)
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  const C = 2 * Math.PI * 21
  return (
    <AnimatePresence>
      {y > 400 && (
        <motion.button initial={{ opacity: 0, scale: 0.6, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.94 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
          className="group fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-line/10 bg-surface/80 shadow-lg backdrop-blur-md">
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgb(var(--line) / 0.12)" strokeWidth="2" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgb(var(--accent))" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
          </svg>
          <ArrowUp size={18} className="transition duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { label: 'Home', href: '#' },
  { label: 'Visual Design', href: '#/design' },
  { label: 'Motion & Film', href: '#/videos' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' }
]

export default function Navbar({ name }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-line/10 bg-surface/80 px-5 py-1.5 backdrop-blur-md lg:py-2.5">
        <a href="#" className="text-sm font-semibold tracking-tight">{name}</a>
        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.label}><a href={l.href} className="text-sm text-muted transition hover:text-ink">{l.label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="grid h-11 w-11 place-items-center rounded-full text-muted lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-5xl rounded-3xl border border-line/10 bg-surface p-3 lg:hidden">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-base hover:bg-line/5">{l.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ProjectModal from './ProjectModal.jsx'

const PAGE_SIZE = 8
const chip = (on) => `rounded-full px-4 py-2 text-sm font-medium transition ${on ? 'bg-accent text-white' : 'border border-line/15 text-muted hover:text-ink hover:bg-line/5'}`

// The Visual Design page: all projects, filter by category, pagination. Clicking a card opens the project viewer.
export default function DesignPage({ projects, contactHref }) {
  const [cat, setCat] = useState('All')
  const [page, setPage] = useState(1)
  const [active, setActive] = useState(null)
  const top = useRef(null)

  const cats = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]
  const list = projects.filter((p) => cat === 'All' || p.category === cat)
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const slice = list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)

  const goPage = (p) => { setPage(p); top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const pb = (on, off) => `grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm transition ${on ? 'border-accent bg-accent text-white' : 'border-line/20 hover:bg-line/5'} ${off ? 'pointer-events-none opacity-40' : ''}`

  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">
      <a href="#" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink"><ArrowLeft size={16} /> Back to home</a>
      <header className="mx-auto mt-6 max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Explore my <span className="text-accent">Visual Design</span></h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">Graphic design, branding and marketing creatives.</p>
      </header>

      <div ref={top} className="mt-12 scroll-mt-24 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">Filter by category</p>
        <div className="flex flex-wrap justify-center gap-2">
          {cats.map((c) => <button key={c} onClick={() => { setCat(c); setPage(1) }} className={chip(cat === c)}>{c}</button>)}
        </div>
      </div>

      {slice.length ? (
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {slice.map((p) => (
            <button key={p.id} onClick={() => setActive(p)} className="group text-left">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-line/10 bg-surface">
                <img src={p.cover} alt={`${p.title} cover`} width="800" height="1000" loading="lazy" draggable={false} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <h3 className="mt-3 font-medium leading-snug">{p.title}</h3>
              <p className="text-sm text-muted">{p.category}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted">No projects in this category yet.</p>
      )}

      <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => goPage(cur - 1)} className={pb(false, cur === 1)} disabled={cur === 1}>Prev</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => goPage(n)} aria-current={n === cur ? 'page' : undefined} className={pb(n === cur, false)}>{n}</button>
        ))}
        <button onClick={() => goPage(cur + 1)} className={pb(false, cur === pages)} disabled={cur === pages}>Next</button>
      </nav>

      <div className="mt-10 text-center">
        <a href={contactHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90">
          Contact me <ArrowRight size={16} />
        </a>
      </div>
      <AnimatePresence>{active && <ProjectModal key={active.id} project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </main>
  )
}

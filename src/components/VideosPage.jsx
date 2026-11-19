import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import VideoCard from './VideoCard.jsx'
import VideoModal from './VideoModal.jsx'

const PAGE_SIZE = 6

const chip = (on) => `rounded-full px-4 py-2 text-sm font-medium transition ${on ? 'bg-accent text-white' : 'border border-line/15 text-muted hover:text-ink hover:bg-line/5'}`

export default function VideosPage({ videos, contactHref }) {
  const [cat, setCat] = useState('All')
  const [page, setPage] = useState(1)
  const [active, setActive] = useState(null)
  const top = useRef(null)

  const cats = ['All', ...new Set(videos.map((v) => v.category).filter(Boolean))]
  const list = videos.filter((v) => cat === 'All' || v.category === cat)
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const slice = list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)

  const goPage = (p) => { setPage(p); top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const pick = (setter) => (v) => { setter(v); setPage(1) }
  const open = (v, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setActive({ video: v, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } })
  }
  const pb = (on, off) => `grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm transition ${on ? 'border-accent bg-accent text-white' : 'border-line/20 hover:bg-line/5'} ${off ? 'pointer-events-none opacity-40' : ''}`

  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">
      <a href="#" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink"><ArrowLeft size={16} /> Back to home</a>
      <header className="mx-auto mt-6 max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Explore my <span className="text-accent">Motion & Film</span></h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">Video editing, motion graphics and cinematic color grading projects.</p>
      </header>

      <div ref={top} className="mt-12 scroll-mt-24 space-y-5 text-center">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">Filter by category</p>
          <div className="flex flex-wrap justify-center gap-2">
            {cats.map((c) => <button key={c} onClick={() => pick(setCat)(c)} className={chip(cat === c)}>{c}</button>)}
          </div>
        </div>
      </div>

      {slice.length ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {slice.map((v) => <VideoCard key={v.id} video={v} onOpen={open} wide />)}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted">No videos match these filters.</p>
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
      <AnimatePresence>{active && <VideoModal key={active.video.id} video={active.video} origin={active.origin} onClose={() => setActive(null)} />}</AnimatePresence>
    </main>
  )
}

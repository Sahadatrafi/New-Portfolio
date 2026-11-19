import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'

const initials = (n) => n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

function ReviewCard({ r }) {
  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-line/10 bg-surface p-7 shadow-2xl">
      <div className="flex items-start justify-between">
        <Quote size={34} className="text-accent/30" fill="currentColor" aria-hidden="true" />
        <div className="flex items-center gap-3">
          {r.rating > 0 && (
            <div className="flex gap-0.5 text-amber-400" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: r.rating }, (_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
          )}
          {r.sample && <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">Sample</span>}
        </div>
      </div>
      {r.screenshot ? (
        <a href={r.screenshot} target="_blank" rel="noopener noreferrer" className="mt-3 block min-h-0 flex-1 overflow-hidden rounded-2xl bg-bg">
          <img src={r.screenshot} alt={`Review from ${r.name}`} loading="lazy" draggable={false} className="h-full w-full object-contain" />
        </a>
      ) : (
        <p className="mt-3 flex-1 overflow-y-auto text-lg leading-relaxed">{r.quote}</p>
      )}
      <div className="mt-5 flex items-center gap-3 border-t border-line/10 pt-4">
        {r.avatar
          ? <img src={r.avatar} alt="" width="44" height="44" loading="lazy" className="h-11 w-11 rounded-full object-cover" />
          : <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent">{initials(r.name)}</span>}
        <div className="min-w-0">
          <p className="truncate font-medium leading-tight">{r.name}</p>
          <p className="truncate text-sm text-muted">{r.role}</p>
        </div>
      </div>
    </div>
  )
}

// A deck of cards: drag or tap the arrows to send the front card to the back.
export default function Reviews({ data }) {
  const items = data.items || []
  const [order, setOrder] = useState(() => items.map((_, i) => i))
  if (!items.length) return null
  const next = () => setOrder((o) => [...o.slice(1), o[0]])
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)])
  const onKey = (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }
  const btn = 'grid h-11 w-11 place-items-center rounded-full border border-line/20 transition hover:bg-line/5'

  return (
    <section id="reviews" className="section-y mx-auto max-w-5xl px-6">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-muted">{data.eyebrow}</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{data.title}</h2>
          <p className="mt-4 max-w-sm text-lg text-muted">{data.intro}</p>
          {items.length > 1 && (
            <div className="mt-8 flex items-center gap-3">
              <button onClick={prev} aria-label="Previous review" className={btn}><ArrowLeft size={18} /></button>
              <button onClick={next} aria-label="Next review" className={btn}><ArrowRight size={18} /></button>
              <span className="ml-2 text-sm tabular-nums text-muted" aria-live="polite">{order[0] + 1} / {items.length}</span>
            </div>
          )}
        </div>

        <div role="region" aria-roledescription="carousel" aria-label="Client reviews" tabIndex={0} onKeyDown={onKey} className="relative mx-auto h-[400px] w-full max-w-md focus:outline-none sm:h-[380px]">
          {items.map((r, idx) => {
            const pos = order.indexOf(idx)
            const front = pos === 0
            return (
              <motion.div key={idx} className="absolute inset-x-0 top-0 h-[340px] sm:h-[330px]" style={{ zIndex: items.length - pos, touchAction: 'pan-y' }}
                drag={front && items.length > 1 ? 'x' : false} dragSnapToOrigin dragElastic={0.5}
                onDragEnd={(_, i) => { if (i.offset.x < -100 || i.velocity.x < -500) next(); else if (i.offset.x > 100 || i.velocity.x > 500) prev() }}
                animate={{ scale: 1 - Math.min(pos, 3) * 0.06, y: Math.min(pos, 3) * 18, rotate: front ? 0 : pos % 2 ? 3 : -3, opacity: pos > 2 ? 0 : 1 - pos * 0.18 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }} aria-hidden={!front}>
                <ReviewCard r={r} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { duration, formatMonth } from '../lib/content.js'

// Compact, quiet section: three small cards side by side.
export default function Experience({ items }) {
  return (
    <section id="experience" className="section-y mx-auto max-w-5xl px-6">
      <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((it, i) => {
          const current = !it.end
          return (
            <motion.li key={it.company + it.start} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-line/10 bg-surface p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-muted">{formatMonth(it.start)} – {current ? 'Present' : formatMonth(it.end)} · {duration(it.start, it.end)}</p>
                {current && <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">Current</span>}
              </div>
              <h3 className="mt-3 font-semibold leading-snug">{it.role}</h3>
              <p className="text-sm text-muted">{it.company}{it.note ? ` · ${it.note}` : ''}</p>
              {it.details?.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted marker:text-accent">
                  {it.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              )}
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}

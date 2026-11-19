import { motion } from 'framer-motion'

const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }

// Small looping animations, one per service. Purely decorative.
function EditVisual() {
  const bars = [[6, 38, 'bg-blue-500', 12], [48, 30, 'bg-indigo-500', 12], [14, 26, 'bg-sky-500', 44], [44, 40, 'bg-violet-500', 44], [10, 22, 'bg-cyan-500', 76]]
  return (
    <div className="relative h-full w-full">
      {bars.map(([l, w, c, t], i) => <span key={i} className={`absolute h-6 rounded-md ${c}`} style={{ left: `${l}%`, width: `${w}%`, top: t }} />)}
      <span className="sv-sweep absolute inset-y-0 w-0.5 bg-red-500" />
    </div>
  )
}
function MotionVisual() {
  return (
    <div className="flex h-full items-end justify-center gap-5 pb-5">
      {['rounded-full bg-accent', 'rounded-md bg-sky-500', 'rotate-45 rounded-sm bg-violet-500'].map((c, i) => (
        <span key={i} className={`sv-hop h-8 w-8 ${c}`} style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  )
}
function ColorVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5">
      <span className="sv-hue h-4 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500" />
      {[0, 1, 2].map((i) => (
        <span key={i} className="relative h-1 rounded-full bg-line/15">
          <span className="sv-slide absolute -top-1.5 h-4 w-4 rounded-full bg-accent shadow" style={{ animationDuration: `${2.6 + i * 0.8}s`, animationDelay: `${-i}s` }} />
        </span>
      ))}
    </div>
  )
}
function DesignVisual() {
  return (
    <svg viewBox="0 0 200 96" className="h-full w-full" aria-hidden="true">
      <path className="sv-draw" d="M16 70 C 50 8, 90 8, 110 48 S 160 88, 184 26" fill="none" stroke="rgb(var(--accent))" strokeWidth="3" strokeLinecap="round" />
      {[[16, 70], [110, 48], [184, 26]].map(([x, y]) => <rect key={x} x={x - 4} y={y - 4} width="8" height="8" rx="1.5" fill="rgb(var(--surface))" stroke="rgb(var(--accent))" strokeWidth="2" />)}
    </svg>
  )
}
const VISUALS = { film: EditVisual, sparkles: MotionVisual, sliders: ColorVisual, pen: DesignVisual }

export default function Services({ data }) {
  return (
    <section id="services" className="section-y mx-auto max-w-5xl px-6">
      <div className="text-center">
        <p className="text-muted">{data.eyebrow}</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{data.title}</h2>
      </div>
      <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.items.map((it) => {
          const Visual = VISUALS[it.icon] || EditVisual
          return (
            <motion.article key={it.title} variants={rise} whileHover={{ y: -6 }} className="group rounded-3xl border border-line/10 bg-surface p-5 transition-shadow hover:shadow-xl">
              <div className="h-28 overflow-hidden rounded-2xl bg-accent/5" aria-hidden="true"><Visual /></div>
              <h3 className="mt-5 text-lg font-semibold leading-snug">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{it.text}</p>
            </motion.article>
          )
        })}
      </motion.div>
    </section>
  )
}

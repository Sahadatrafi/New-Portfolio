import { motion } from 'framer-motion'
import { Scissors, Send, Upload } from 'lucide-react'

const ICONS = { upload: Upload, scissors: Scissors, send: Send }

// Three steps on a line that draws itself; each step lights up as the line reaches it.
export default function Process({ data }) {
  const n = data.steps.length
  return (
    <section id="process" className="section-y mx-auto max-w-5xl px-6">
      <div className="text-center">
        <p className="text-muted">{data.eyebrow}</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{data.title}</h2>
      </div>

      <ol className="relative mt-14 grid gap-2 md:grid-cols-3 md:gap-6">
        <div className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-px bg-line/15 md:block" aria-hidden="true">
          <motion.div className="h-full origin-left bg-accent" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }} />
        </div>
        {data.steps.map((st, i) => {
          const Icon = ICONS[st.icon] || Send
          const delay = 0.2 + (i / Math.max(n - 1, 1)) * 1.8
          return (
            <motion.li key={st.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: i * 0.25 }}
              className="group relative flex flex-col items-center text-center">
              <motion.span initial={{ scale: 0.6, backgroundColor: 'rgb(var(--surface))' }} whileInView={{ scale: 1, backgroundColor: 'rgb(var(--accent))' }} viewport={{ once: true, margin: '-100px' }} transition={{ delay, duration: 0.4 }}
                className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-line/15 text-white shadow-lg shadow-accent/30"><Icon size={20} /></motion.span>
              <motion.div whileHover={{ y: -6 }} className="mt-5 min-h-[14rem] w-full flex-1 rounded-3xl border border-line/10 bg-surface p-7 transition-shadow hover:shadow-xl">
                <span className="block text-6xl font-bold leading-none tracking-tight text-accent/15 transition-colors duration-300 group-hover:text-accent/40">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-xl font-semibold leading-snug">{st.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{st.text}</p>
              </motion.div>
              {i < n - 1 && <span className="my-3 block h-8 w-px bg-accent/30 md:hidden" aria-hidden="true" />}
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}

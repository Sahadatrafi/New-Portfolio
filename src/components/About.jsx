import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Clapperboard, GraduationCap, PenTool } from 'lucide-react'

const rise = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }

function Portrait({ src, name }) {
  const [failed, setFailed] = useState(false)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 140, damping: 14 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 14 })
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 16 })
  const imgY = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 16 })
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const leave = () => { mx.set(0); my.set(0) }
  const chip = 'absolute z-10 flex items-center gap-2 rounded-full border border-line/10 bg-surface/90 px-3.5 py-2 text-sm font-medium shadow-lg backdrop-blur'
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mx-auto w-full max-w-sm" onMouseMove={move} onMouseLeave={leave} style={{ perspective: 900 }}>
      <div className="about-blob absolute -inset-3 sm:-inset-6 bg-gradient-to-br from-accent/50 via-sky-400/25 to-transparent blur-sm" aria-hidden="true" />
      <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-accent/50 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5" aria-hidden="true" />
      <motion.div style={{ rotateX, rotateY }} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line/10 bg-surface shadow-2xl">
        {src && !failed ? (
          <motion.img src={src} alt={name} width="800" height="1000" loading="lazy" draggable={false} onError={() => setFailed(true)}
            style={{ x: imgX, y: imgY }} className="h-full w-full scale-110 object-cover object-top transition-transform duration-700 group-hover:scale-[1.18]" />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 text-center text-sm text-white/70">Sample: add your photo from the Admin dashboard.</div>
        )}
      </motion.div>
      <div className={`${chip} -left-4 top-10 skill-float`} style={{ '--dur': '5.2s', '--dy': '-9px', '--dx': '3px', '--rot': '0deg' }}><PenTool size={16} className="text-accent" />Graphic Designer</div>
      <div className={`${chip} -right-4 bottom-14 skill-float`} style={{ '--dur': '6s', '--delay': '-2s', '--dy': '-10px', '--dx': '-3px', '--rot': '0deg' }}><Clapperboard size={16} className="text-accent" />Video Editor</div>
    </motion.div>
  )
}

export default function About({ data, fallbackImage, name }) {
  const edu = data.education
  return (
    <section id="about" className="section-y mx-auto max-w-5xl px-6">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Portrait src={data.image || fallbackImage} name={name} />
        <motion.div variants={{ show: { transition: { staggerChildren: 0.12 } } }} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <motion.p variants={rise} className="text-muted">{data.eyebrow}</motion.p>
          <motion.h2 variants={rise} className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{data.title}</motion.h2>
          {data.paragraphs.map((p) => <motion.p key={p} variants={rise} className="mt-5 text-lg leading-relaxed text-muted">{p}</motion.p>)}
          {data.focus?.length > 0 && (
            <motion.ul variants={rise} className="mt-6 flex flex-wrap gap-2">
              {data.focus.map((f) => <li key={f} className="rounded-full border border-line/15 px-3.5 py-1.5 text-sm text-muted">{f}</li>)}
            </motion.ul>
          )}
          {edu && (
            <motion.div variants={rise} whileHover={{ y: -4 }} className="mt-8 flex items-start gap-4 rounded-3xl border border-line/10 bg-surface p-5 shadow-sm">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent"><GraduationCap size={22} /></span>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted">{edu.label}</p>
                <p className="mt-1 text-sm font-medium text-accent">{edu.period}</p>
                <p className="mt-1 text-lg font-semibold leading-snug">{edu.degree}</p>
                <p className="text-muted">{edu.institution}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
